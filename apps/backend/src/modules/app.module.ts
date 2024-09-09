import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { join } from "path"
import { UsersModule } from "./users/users.module"
import { AppResolver } from "./app.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { isProductionEnv } from "../utils"
import { HealthModule } from "./health/health.module"
import { AuthenticationModule } from "./authentication/authentication.module"
import { ProfilesModule } from "./profiles/profiles.module"
import { configSchema } from "../config"
import { TypeormConfigService } from "./typeorm-config.service"

const GRAPHQL_SCHEMA_GENERATION_PATH = join(
  process.cwd(),
  "apps/backend/src/graphql/__generated__/schema.graphql"
)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      envFilePath: [join(process.cwd(), "apps/backend/.dev.env")],
      ignoreEnvFile: isProductionEnv,
      cache: true,
      validate: (config: Record<string, unknown>) => configSchema.parse(config)
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: isProductionEnv ? true : GRAPHQL_SCHEMA_GENERATION_PATH,

      csrfPrevention: isProductionEnv,
      introspection: !isProductionEnv,
      includeStacktraceInErrorResponses: !isProductionEnv,
      playground: false,
      plugins: !isProductionEnv ? [ApolloServerPluginLandingPageLocalDefault()] : []
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService
    }),

    AuthenticationModule,
    UsersModule,
    ProfilesModule,

    HealthModule
  ],

  providers: [AppResolver]
})
export class AppModule {}
