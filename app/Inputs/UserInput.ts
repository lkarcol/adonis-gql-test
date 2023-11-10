import { Field, InputType, registerEnumType } from 'type-graphql'
import User from '../GqlModels/UserGql'

export enum Role {
  Admin = 'Admin',
  User = 'User'
}

registerEnumType(Role, {
  name: 'Role',
})

@InputType({ description: 'New user data' })
export class CreateUserInput implements Partial<User> {
  @Field()
  public email: string

  @Field()
  public password: string

  @Field(() => Role)
  public role: Role
}
