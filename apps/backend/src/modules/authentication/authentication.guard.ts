import { ExecutionContext, Injectable } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { AuthGuard } from "@nestjs/passport"

@Injectable( )
export class AuthenticationGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const graphQLExecutionContext= GqlExecutionContext.create(context)
    return graphQLExecutionContext.getContext( ).req
  }
}