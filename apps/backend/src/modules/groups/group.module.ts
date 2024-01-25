import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GroupEntity, UserGroupJunctionEntity } from "./group.entity"
import { ProfileEntity } from "../profiles/profile.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([ GroupEntity, ProfileEntity, UserGroupJunctionEntity ])
  ]
})
export class GroupsModule { }