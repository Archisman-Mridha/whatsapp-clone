import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JWTPayload } from "./types"
import { UsersService } from "../users/users.service"
import { ConfigService } from "@nestjs/config"
import { Injectable } from "@nestjs/common"
import { Config } from "../../config"
import { ApplicationErrors } from "../../utils"

@Injectable()
export class PassportJWTStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Config>, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
      ignoreExpiration: false
    })
  }

  async validate(payload: JWTPayload): Promise<string> {
    const userId = payload.userId

    await this.usersService.doesUserWithIdExist(userId).then(exists => {
      if (!exists) throw ApplicationErrors.UNAUTHENTICATED
    })

    return userId
  }
}
