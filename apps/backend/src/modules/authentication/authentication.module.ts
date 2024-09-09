import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { UsersModule } from "../users/users.module"
import { PassportJWTStrategy } from "./passport-jwt.strategy"

@Module({
  imports: [PassportModule, UsersModule],
  providers: [PassportJWTStrategy]
})
export class AuthenticationModule {}
