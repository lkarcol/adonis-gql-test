import { MiddlewareFn } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Adonis Session is inactive in Apollo Server Request
// This middlaware is used as global in buildSchema function 

export const GqlSessionActivator: MiddlewareFn<HttpContextContract> = async (
  { context, info },
  next
) => {
  const { session } = context
  await session.initiate(false)
  return next()
}
