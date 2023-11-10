import { Field, ObjectType } from 'type-graphql'
import User from './UserGql'

@ObjectType()
class Post {
  @Field()
  public id: number

  @Field()
  public title: string

  @Field()
  public premiumTitle: string

  @Field(() => User)
  public author: User
}

export default Post
