import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JWTPayload } from "./types"
import { UsersService } from "../users/users.service"
import { UnAuthenticatedError, configSchema } from "../../utils"
import { ConfigService } from "@nestjs/config"
import { Injectable } from "@nestjs/common"

@Injectable( )
export class PassportJWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService<typeof configSchema._type>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken( ),
      secretOrKey: config.get("JWT_SECRET"),
      ignoreExpiration: false
    })
  }

  async validate(payload: JWTPayload): Promise<string> {
    const userId= payload.userId

    await this.usersService.doesUserWithIdExist(userId)
      .then(exists => {
        if(!exists)
          throw UnAuthenticatedError
      })

    return userId
  }
}