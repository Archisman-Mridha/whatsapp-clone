import { Field, InputType } from "@nestjs/graphql"
import { ArrayMaxSize, ArrayMinSize, Length } from "class-validator"

@InputType( )
export class CreateGroupArgs {
  @Length(1, 50)
  @Field( )
  name: string

  @Length(1, 150)
  @Field({ nullable: true })
  description: string

  @ArrayMinSize(2)
  @ArrayMaxSize(500)
  @Field(( ) => [Number])
  userIds: number[ ]
}