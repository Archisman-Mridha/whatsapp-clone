import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import { Config } from "../config"
import { UserEntity } from "./users/user.entity"
import { ProfileEntity } from "./profiles/profile.entity"

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<Config>) {}

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
