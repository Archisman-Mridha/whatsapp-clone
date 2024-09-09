import { Injectable } from "@nestjs/common"
import { Query, Resolver } from "@nestjs/graphql"

@Injectable() // Attaches metadata, which declares that this class can be instantiated and injected
// by the Nest IoC container.

@Resolver() // Corresponding GraphQL schema definition and resolver map are automatically
// generated using the provided metadata.
export class AppResolver {
  @Query(() => String)
  ping(): string {
    return "pong"
  }
}
