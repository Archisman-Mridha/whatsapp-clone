import { Field, ObjectType } from "@nestjs/graphql"
import { ArrayMaxSize, ArrayMinSize, Length } from "class-validator"
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { ProfileEntity } from "../profiles/profile.entity"

@Entity({ name: "groups" })
@ObjectType({ isAbstract: true })
export class GroupEntity {

  @PrimaryGeneratedColumn( )
  @Field( )
  id: number

  @Column( )
  @Length(1, 50)
  @Field( )
  name: string

  @Column({ nullable: true })
  @Length(1, 150)
  @Field({ nullable: true })
  description: string

  @ManyToMany(_elementType => ProfileEntity, member => member.groups)
  @JoinColumn({ name: "user_ids", referencedColumnName: "id" })
  @ArrayMinSize(2)
  @ArrayMaxSize(500)
  @Field(( ) => [ProfileEntity])
  users: [ProfileEntity]
}

@Entity({ name: "user_group_junctions" })
export class UserGroupJunctionEntity {

  @PrimaryColumn({ name: "user_id", type: "int" })
  userId: Number

  @PrimaryColumn({ name: "group_id", type: "int" })
  groupId: Number

  @ManyToOne(_type => ProfileEntity, user => user.groups, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: ProfileEntity

  @ManyToOne(_type => GroupEntity, group => group.users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "group_id", referencedColumnName: "id" })
  group: GroupEntity

  @Column({ name: "is_admin", default: false })
  isAdmin: boolean

  // NOTE - The { onDelete: "cascade" } here means that if the group / user gets deleted, then
  // delete the related junction rows.
}