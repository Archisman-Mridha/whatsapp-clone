import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "./user.entity"
import { EntityNotFoundError, Repository } from "typeorm"
import { AuthenticationResponse, SigninArgs, SignupArgs, VerifyAccountArgs } from "./types"
import { TwilioService } from "nestjs-twilio"
import { ConfigService } from "@nestjs/config"
import { KafkaRetriableException } from "@nestjs/microservices"
import { JwtService } from "@nestjs/jwt"
import { JWTPayload } from "../authentication/types"
import { compare } from "bcrypt"
import { Config } from "../../config"
import { ApplicationErrors } from "../../utils"

@Injectable()
export class UsersService {
  private twilioVerifyService: ReturnType<typeof this.twilioService.client.verify.v2.services>

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly configService: ConfigService<Config>,
    private readonly twilioService: TwilioService,
    private readonly jwtService: JwtService
  ) {
    this.twilioVerifyService = this.twilioService.client.verify.v2.services(
      this.configService.get("TWILIO_VERIFY_SID")
    )
  }

  private readonly logger = new Logger("UsersModule")

  // throws : PhoneIsAlreadyRegisteredError / ServerError
  async signup(args: SignupArgs) {
    const { identifiers } = await this.usersRepository.insert(args).catch((error: Error) => {
      if (error.message.includes("duplicate key value violates unique constraint"))
        throw new Error(ApplicationErrors.PHONE_IS_ALREADY_REGISTERED)

      this.logger.error("Unexpected error occurred when saving user", error)
      throw new Error(ApplicationErrors.SERVER)
    })

    if (identifiers.length > 0) this.logger.log(`New user created with id ${identifiers[0].id}`)
  }

  // throws : KafkaRetriableException
  async sendVerificationOTP(phone: string) {
    await this.twilioVerifyService.verifications
      .create({ to: phone, channel: "sms" })
      .catch(error => {
        this.logger.error("Unexpected error sending OTP for account verification", error)
        throw new KafkaRetriableException("")
      })

    this.logger.log(`Account verification OTP has been sent to ${phone}`)
  }

  // throws : RetryOTPVerificationError / ServerError
  async verifyAccount(args: VerifyAccountArgs) {
    const { status } = await this.twilioVerifyService.verificationChecks
      .create({ to: args.phone, code: args.otp })
      .catch(error => {
        this.logger.error("Unexpected error doing OTP verification check", error)
        throw new Error(ApplicationErrors.SERVER)
      })

    switch (status) {
      case "pending":
        throw new Error(ApplicationErrors.RETRY_OTP_VERIFICATION)

      case "canceled":
        throw new Error(ApplicationErrors.SERVER)
    }

    this.logger.log(`User with ${args.phone} has been verified`)
  }

  // throws : ServerError
  async doesUserWithIdExist(id: string): Promise<boolean> {
    await this.usersRepository
      .findOneOrFail({ where: { id: parseInt(id) }, select: { id: true } })
      .catch(error => {
        if (error instanceof EntityNotFoundError) return false

        this.logger.error("Unexpected error finding user", error)
        throw new Error(ApplicationErrors.SERVER)
      })

    return true
  }

  // throws : ServerError
  async getIdOfUserWithPhone(phone: string): Promise<string> {
    const { id } = await this.usersRepository
      .findOneOrFail({ where: { phone }, select: { id: true } })
      .catch(error => {
        this.logger.error("Unexpected error finding id of user with phone", error)
        throw new Error(ApplicationErrors.SERVER)
      })

    return id.toString()
  }

  // throws : ServerError
  async signin(args: SigninArgs): Promise<AuthenticationResponse> {
    const user = await this.usersRepository
      .findOneOrFail({
        where: { phone: args.phone },
        select: { id: true, password: true }
      })
      .catch(error => {
        this.logger.error("Unexpected error finding user by phone", error)
        throw new Error(ApplicationErrors.SERVER)
      })

    const passwordMatched = await compare(args.password, user.password).catch(error => {
      this.logger.error("Unexpected error verifying password using bcrypt", error)
      throw new Error(ApplicationErrors.SERVER)
    })

    if (!passwordMatched) throw new Error(ApplicationErrors.WRONG_PASSWORD)

    return {
      accessToken: this.jwtService.sign({ userId: user.id.toString() } as JWTPayload)
    }
  }

  async deleteAccount(userId: number) {
    await this.usersRepository.delete(userId)
  }
}
