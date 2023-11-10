import { AuthChecker, MiddlewareFn } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreatePostInput } from 'App/Inputs/PostInput'

export const PostGuard: MiddlewareFn<HttpContextContract> = async ({ args, context }, next) => {
  const { auth, bouncer } = context

  await auth.use('web').authenticate()

  const isAllowedUsePremiumTitle = await bouncer
    .with('PostPolicy')
    .allows('premiumTitle', args.data as CreatePostInput)

  if (isAllowedUsePremiumTitle) {
    return next()
  }

  args.data.premiumTitle = 'Payme my money down'

  return next()
}
