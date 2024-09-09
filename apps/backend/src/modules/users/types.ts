import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql"
import { UserEntity } from "./user.entity"

@InputType()
export class SignupArgs extends PickType(UserEntity, ["name", "phone", "password"], InputType) {}

class UserDbRowCDCProjection extends PickType(UserEntity, ["id", "name", "phone", "isVerified"]) {}

export interface UserDbEvent {
  payload: {
    before?: UserDbRowCDCProjection
    after?: UserDbRowCDCProjection
    op: "c" | "r" | "u" | "d"
  }
}

@InputType()
export class VerifyAccountArgs extends PickType(UserEntity, ["phone"], InputType) {
  @Field()
  otp: string
}

@InputType()
export class SigninArgs extends PickType(UserEntity, ["phone", "password"], InputType) {}

@ObjectType()
export class AuthenticationResponse {
  @Field()
  accessToken: string
}
