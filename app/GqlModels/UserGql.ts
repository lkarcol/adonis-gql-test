import { Field, ObjectType, registerEnumType } from 'type-graphql'
import Post from './PostGql'
import { Role } from '../Inputs/UserInput'
import { UserPlan } from 'App/Models/User'

registerEnumType(UserPlan, {
  name: 'UserPlan',
})

@ObjectType()
class User {
  @Field()
  public id: string

  @Field()
  public email: string

  @Field(() => Role, { nullable: true })
  public role: Role

  @Field(() => UserPlan)
  public plan: UserPlan

  @Field(() => [Post])
  public posts: Post[]

  @Field(() => [Post])
  public posts2: Post[]
}

export default User
