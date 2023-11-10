import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User, { UserPlan } from '../Models/User'
import { CreatePostInput } from 'App/Inputs/PostInput'

export default class PostPolicy extends BasePolicy {
  public async premiumTitle(user: User, post: CreatePostInput) {
    if (post.premiumTitle) {
      return user.plan === UserPlan.Pro
    }
    return true
  }
}
