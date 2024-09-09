import { Field, ObjectType } from "@nestjs/graphql"
import { Length } from "class-validator"
import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ name: "profiles" })
@ObjectType({ isAbstract: true })
export class ProfileEntity {
  @PrimaryColumn()
  @Field()
  id: number

  @Column()
  @Length(2, 50)
  @Field()
  name: string

  @Column({ nullable: true })
  @Length(1, 150)
  @Field({ nullable: true })
  status: string

  @Column({ unique: true })
  @Field()
  phone: string
}
