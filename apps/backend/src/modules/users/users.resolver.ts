import { Injectable, UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { UsersService } from "./users.service"
import { AuthenticationResponse, SigninArgs, SignupArgs, VerifyAccountArgs } from "./types"
import { JwtService } from "@nestjs/jwt"
import { JWTPayload } from "../authentication/types"
import { AuthenticationGuard } from "../authentication/authentication.guard"
import { GetCurrentUserId } from "../authentication/get-current-user-id.decorater"

@Injectable( )
@Resolver( )
export class UsersResolver {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  @Mutation(( ) => Boolean, { nullable: true })
  async signup(@Args("args") args: SignupArgs) {
    await this.usersService.signup(args)
  }

  @Mutation(( ) => AuthenticationResponse)
  async verifyAccount(@Args("args") args: VerifyAccountArgs): Promise<AuthenticationResponse> {
    await this.usersService.verifyAccount(args)

    const userId= await this.usersService.getIdOfUserWithPhone(args.phone)
    const accessToken= this.jwtService.sign({ userId } as JWTPayload)

    return { accessToken }
  }

  @Query(( ) => AuthenticationResponse)
  async signin(@Args("args") args: SigninArgs): Promise<AuthenticationResponse> {
    return this.usersService.signin(args)
  }

  @Mutation(( ) => Boolean, { nullable: true })
  @UseGuards(AuthenticationGuard)
  async deleteAccount(@GetCurrentUserId( ) userId: number) {
    this.usersService.deleteAccount(userId)
  }
}