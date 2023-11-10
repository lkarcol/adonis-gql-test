import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import User from '../Models/User'
import UserGql from '../GqlModels/UserGql'

import PostGql from '../GqlModels/PostGql'
import { CreatePostInput, DeletePostInput } from '../Inputs/PostInput'
import CurrentUser from '../Decorators/UserCtx'
import Post from '../Models/Post'
import { Role } from 'App/Inputs/UserInput'
import { PostGuard } from 'App/Decorators/PostGuard'

@Resolver(() => PostGql)
export default class UserResolver {
  @Authorized()
  @Mutation(() => PostGql)
  @UseMiddleware(PostGuard)
  public async createPost(@Arg('data') postData: CreatePostInput, @CurrentUser() user: User) {
    const post = await user.related('posts').create({
      ...postData,
      userId: user.id,
    })

    return post
  }

  @Authorized<Role>([Role.Admin])
  @Mutation(() => [Number])
  public async deletPost(@Arg('data') postData: DeletePostInput, @CurrentUser() user: User) {
    const deletedPostsCount = await Post.query().delete('id').whereIn('id', postData.ids)
    return deletedPostsCount
  }

  @Query(() => [PostGql])
  public async posts() {
    const posts = await Post.all()
    return posts
  }

  @FieldResolver(() => UserGql)
  public async author(@Root() post: Post) {
    return await User.findBy('id', post.userId)
  }
}
