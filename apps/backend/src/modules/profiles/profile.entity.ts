import { Field, ObjectType } from "@nestjs/graphql"
import { Length } from "class-validator"
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"
import { GroupEntity } from "../groups/group.entity"

@Entity({ name: "profiles" })
@ObjectType({ isAbstract: true })
export class ProfileEntity {

  @PrimaryColumn( )
  @Field( )
  id: number

  @Column( )
  @Length(2, 50)
  @Field( )
  name: string

  @Column({ nullable: true })
  @Length(1, 150)
  @Field({ nullable: true })
  status: string

  @Column({ unique: true })
  @Field( )
  phone: string

  @ManyToMany(_elementType => GroupEntity, group => group.users)
  @JoinTable({
    // Name of the junction table which will be created to represent the many-to-many relationship.
    name: "user_group_junctions",
    /*
      Shape of the juntion table :

                             |--> 'id' column of the 'users' table
                             |
      +----------------------|------------------------+
      |               |               |               |
      |   user_id     |   group_id    |   is_admin    |
      +-----|-----------------------------------------+
            |
            |--> 'id' column of the 'groups' table
    */

    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "group_id",
      referencedColumnName: "id"
    }
  })
  @JoinColumn({ name: "group_ids" })
  @Field(( ) => [GroupEntity])
  groups: [GroupEntity]
}