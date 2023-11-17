import { Field, InputType } from 'type-graphql'
import Post from '../GqlModels/PostGql'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export const createPostInputValidation = schema.create({
  title: schema.string([rules.maxLength(20)]),
})

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
