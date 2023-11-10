import { AuthChecker, MiddlewareFn } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Role } from 'App/Inputs/UserInput'

export const AuthGuard: AuthChecker<HttpContextContract, Role> = async (
  { args, context },
  roles
) => {
  const { session, auth } = context
  await session.initiate(false)
  await auth.use('web').authenticate()
  const user = auth.use('web').user

  if (roles.length > 0 && user) {
    return roles.includes(user.role)
  }

  return user !== undefined
}