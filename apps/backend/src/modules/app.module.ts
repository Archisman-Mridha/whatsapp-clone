import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Injectable, Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { join } from "path"
import { UsersModule } from "./users/users.module"
import { AppResolver } from "./app.resolver"
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import { UserEntity } from "./users/user.entity"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { configSchema, isProductionEnv } from "../utils"
import { HealthModule } from "./health/health.module"
import { AuthenticationModule } from "./authentication/authentication.module"
import { ProfileEntity } from "./profiles/profile.entity"
import { ProfilesModule } from "./profiles/profiles.module"

@Injectable()
class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<typeof configSchema._type>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",

      host: this.configService.get("POSTGRES_DB_HOST"),
      port: this.configService.get("POSTGRES_DB_PORT"),
      username: this.configService.get("POSTGRES_DB_USER"),
      password: this.configService.get("POSTGRES_DB_PASSWORD"),
      database: this.configService.get("POSTGRES_DB_NAME"),

      entities: [UserEntity, ProfileEntity]
    }
  }
}

// The Module decorator provides metadata that Nest makes use of to organize the application
// structure.
//
// The root module is the starting point Nest uses to build the application graph - the internal
// data structure Nest uses to resolve module and provider relationships and dependencies.
@Module({
  // The list of imported modules that export the providers which are required in this module.
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      validate: (config: Record<string, unknown>) => configSchema.parse(config),

      ignoreEnvFile: isProductionEnv(),
      envFilePath: !isProductionEnv() && join(process.cwd(), "apps/backend/.env.dev"),

      cache: true
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      autoSchemaFile: isProductionEnv()
        ? true // The schema file will generated in-memory.
        : join(process.cwd(), "apps/backend/src/generated/schema.graphql"),

      includeStacktraceInErrorResponses: !isProductionEnv(),

      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()]
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService
    }),

    AuthenticationModule,
    UsersModule,
    ProfilesModule,

    HealthModule
  ],

  // Providers are instantiated and injected into this class (by Nest) as dependencies.
  providers: [AppResolver]
})
export class AppModule {}
