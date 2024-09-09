import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { ProfilesService } from "./profiles.service"
import { UpdateProfileArgs } from "./types"
import { UseGuards } from "@nestjs/common"
import { AuthenticationGuard } from "../authentication/authentication.guard"
import { GetCurrentUserId } from "../authentication/get-current-user-id.decorater"

@Resolver()
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(AuthenticationGuard)
  async updateProfile(@GetCurrentUserId() userId: number, @Args("args") args: UpdateProfileArgs) {
    await this.profilesService.updateProfile(userId, args)
  }

  @Mutation(() => String)
  @UseGuards(AuthenticationGuard)
  async getPresignedProfilePictureUri(@GetCurrentUserId() userId: number): Promise<string> {
    return this.profilesService.getPresignedProfilePictureUri(userId)
  }
}
