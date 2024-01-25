import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

export const GetCurrentUserId= createParamDecorator(
  (_: any, context: ExecutionContext): number => {
    const userId= GqlExecutionContext.create(context).getContext( )
                                                     .req.user
    return parseInt(userId)
  }
)