import { Field, ObjectType } from "@nestjs/graphql"
import { hash } from "bcrypt"
import { IsAlphanumeric, IsPhoneNumber, Length } from "class-validator"
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "users" })
@ObjectType({ isAbstract: true })
export class UserEntity {

  @PrimaryGeneratedColumn( )
  @Field( )
  id: number

  @Column( )
  @Length(2, 50)
  @Field( )
  name: string

  @Column({ unique: true })
  @Index("users_idx_phone")
  @IsPhoneNumber( )
  @Field( )
  phone: string

  @Column({
    transformer: {
      to: async value => {
        /*
          Bcrypt generates a random value (called salt) and combines it with the password. The
          combination is fed into a hashing function 'n' times (n = number of rounds = 10 here).

          The hashing cost, salt and cipher text are combined together in a single string.

          NOTE - Bcrypt internally uses a modified version of the Blowfish encryption algorithm.
        */

        return await hash(value, 10)
      },

      from: async value => value
    }
  })
  @IsAlphanumeric( )
  @Length(4, 50)
  @Field( )
  password: string

  @Column({ name: "is_verified", default: false })
  @Field( )
  isVerified: boolean
}