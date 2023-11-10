import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User, { UserPlan } from '../Models/User'
import UserGql from '../GqlModels/UserGql'
import Post from '../Models/Post'
import CurrentUser from 'App/Decorators/UserCtx'

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
  public async posts(@Root() user: User) {
    const posts = await Post.query().where('userId', user.id)
    return posts
  }
}
