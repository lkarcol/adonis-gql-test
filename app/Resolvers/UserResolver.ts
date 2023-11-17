import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User, { UserPlan } from '../Models/User'
import UserGql from '../GqlModels/UserGql'
import Post from '../Models/Post'
import CurrentUser from 'App/Decorators/UserCtx'
import GetDataloader, { DataloaderType, DataloderService } from 'App/Decorators/Dataloder'

@Resolver(() => UserGql)
export default class UserResolver {
  @Query((returns) => UserGql)
  public async me(@Ctx() { response, auth, session }: HttpContextContract) {
    await auth.use('web').authenticate()

    const user = await User.findByOrFail('email', auth.user?.email)

    return user.toJSON()
  }

  @Query((returns) => [UserGql])
  public async users() {
    return User.query().select('*').orderBy('id', 'desc')
  }

  @Mutation(() => String)
  public async changePlan(@CurrentUser() user: User) {
    const newPlan = user.plan === UserPlan.Pro ? UserPlan.Free : UserPlan.Pro
    const res = await User.query().update('plan', newPlan).where('id', user.id)
    if (res) return 'ok'
  }

  @FieldResolver()
  public async email(@Root() user: User) {
    return user.email
  }

  // 1 + N problem
  @FieldResolver()
  public async posts2(@Root() user: User) {
    return await Post.query().where('userId', user.id)
  }

  // 1 + N  solved by dataloder
  @FieldResolver()
  public async posts(@Root() user: User, @GetDataloader('posts') loader: DataloderService) {
    const batchFn = async (keys: number[]) => {
      const posts = await Post.query().whereIn('userId', keys).orderBy('createdAt', 'desc')
      return keys.map((key) => posts.filter((p) => p.userId === key))
    }

    return await loader.getDataloder(batchFn).load(user.id)
  }
}
