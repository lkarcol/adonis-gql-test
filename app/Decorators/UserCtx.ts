import { createParamDecorator } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../Models/User'

export default function CurrentUser() {
  return createParamDecorator<HttpContextContract>(async ({ args, context }): Promise<User> => {
    const { auth } = context
    await auth.use('web').authenticate()
    const user = auth.use('web').user!

    return user
  })
}
