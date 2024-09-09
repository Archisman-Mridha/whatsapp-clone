import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProfileEntity } from "./profile.entity"
import { ProfilesService } from "./profiles.service"
import { ProfilesResolver } from "./profiles.resolver"
import { NestMinioModule } from "nestjs-minio"
import { ConfigService } from "@nestjs/config"
import { configSchema } from "../../utils"

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEntity]),

    NestMinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<typeof configSchema._type>) => ({
        endPoint: configService.get("MINIO_ENDPOINT"),
        port: configService.get("MINIO_PORT"),
        accessKey: configService.get("MINIO_ACCESS_KEY"),
        secretKey: configService.get("MINIO_SECRET_KEY"),
        useSSL: false
      })
    })
  ],

  providers: [ProfilesService, ProfilesResolver],

  exports: [ProfilesService]
})
export class ProfilesModule {}
