import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { GroupsService } from "./groups.service"
import { CreateGroupArgs } from "./types"
import { UseGuards } from "@nestjs/common"
import { AuthenticationGuard } from "../authentication/authentication.guard"
import { GetCurrentUserId } from "../authentication/get-current-user-id.decorater"

@Resolver( )
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) { }

  @Mutation(( ) => String)
  @UseGuards(AuthenticationGuard)
  async createGroup(@GetCurrentUserId( ) adminId: number, @Args("args") args: CreateGroupArgs): Promise<string> {
    return this.groupsService.createGroup(adminId, args)
  }
}