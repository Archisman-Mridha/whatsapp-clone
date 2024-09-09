import { Module } from "@nestjs/common"
import { UsersResolver } from "./users.resolver"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./user.entity"
import { UsersService } from "./users.service"
import { TwilioModule } from "nestjs-twilio"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { UsersController } from "./users.controller"
import { JwtModule } from "@nestjs/jwt"
import { ProfilesModule } from "../profiles/profiles.module"
import { Config } from "../../config"
import { Constants } from "../../utils"

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),

    ClientsModule.register([
      {
        name: Constants.KAFKA_CLUSTER as string,
        transport: Transport.KAFKA
      }
    ]),

    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService<Config>) => ({
        accountSid: configService.get("TWILIO_ACCOUNT_SID"),
        authToken: configService.get("TWILIO_AUTH_TOKEN")
      })
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService<Config>) => ({
        signOptions: { expiresIn: "7d" },
        secret: configService.get("JWT_SECRET")
      })
    }),

    ProfilesModule
  ],

  providers: [UsersService, UsersResolver],
  controllers: [UsersController],

  exports: [UsersService]
})
export class UsersModule {}
