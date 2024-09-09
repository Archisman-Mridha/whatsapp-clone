import { Plugin } from "@nestjs/apollo"
import { GraphQLSchemaHost } from "@nestjs/graphql"
import { GraphQLError } from "graphql"
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity"
import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server"

export const MAX_GRAPHQL_QUERY_COMPLEXITY = 30

@Plugin()
export class GraphQLQueryComplexityPlugin implements ApolloServerPlugin {
  constructor(private graphQLSchemaHost: GraphQLSchemaHost) {}

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const { schema } = this.graphQLSchemaHost

    return {
      didResolveOperation: async ({ request, document }) => {
        const queryComplexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })]
        })

        if (queryComplexity > MAX_GRAPHQL_QUERY_COMPLEXITY)
          throw new GraphQLError(
            `Query is too complex: ${queryComplexity}. Maximum allowed complexity: ${MAX_GRAPHQL_QUERY_COMPLEXITY}`
          )
      }
    }
  }
}
