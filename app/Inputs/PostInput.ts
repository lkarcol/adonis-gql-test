import { Field, InputType } from 'type-graphql'
import Post from '../GqlModels/PostGql'

@InputType({ description: 'New post data' })
export class CreatePostInput implements Partial<Post> {
  @Field()
  public title: string

  @Field({ defaultValue: '' })
  public premiumTitle: string
}

@InputType({ description: 'New post data' })
export class DeletePostInput {
  @Field(() => [Number])
  public ids: number[]
}
