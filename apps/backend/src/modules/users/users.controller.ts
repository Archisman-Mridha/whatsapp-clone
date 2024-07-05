import { Controller } from "@nestjs/common"
import { MessagePattern, Payload } from "@nestjs/microservices"
import { UsersService } from "./users.service"
import { KafkaTopic } from "../../utils"
import { UserDbEvent } from "./types"
import { ProfilesService } from "../profiles/profiles.service"

@Controller( )
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService
  ) { }

  @MessagePattern(KafkaTopic.Users)
  async handleDbEvent(@Payload( ) { payload }: UserDbEvent) {
    switch(payload.op) {

      case "c":
        await this.usersService.sendVerificationOTP(payload.after.phone)
        break

      case "u":
        if(!payload.before.isVerified && payload.after.isVerified)
          await this.profilesService.createProfile(payload.after)
        break

      case "d":
        this.profilesService.deleteProfile(payload.before.id)
        break
    }
  }
}