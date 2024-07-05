import { InputType, PickType } from "@nestjs/graphql"
import { ProfileEntity } from "./profile.entity"

export class CreateProfileArgs extends PickType(ProfileEntity, ["id", "name", "phone"]) { }

// Details of the updated profile.
@InputType( )
export class UpdateProfileArgs extends PickType(ProfileEntity, ["name", "status"], InputType) { }