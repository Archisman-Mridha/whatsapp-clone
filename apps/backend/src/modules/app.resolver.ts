import { Injectable } from "@nestjs/common"
import { Query, Resolver } from "@nestjs/graphql"

export const PING_RESPONSE = "pong"

@Injectable()
@Resolver()
export class AppResolver {
  @Query(() => String)
  ping(): string {
    return PING_RESPONSE
  }
}
