import { GraphQLJSON } from 'graphql-scalars'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../Models/User'
import { CreateUserInput } from '../Inputs/UserInput'

@Resolver()
export default class AuthResolver {
  @Query((returns) => GraphQLJSON)
  public async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { response, auth }: HttpContextContract
  ) {
    try {
      const u = await auth.use('web').attempt(email, password)

      return u
    } catch (e) {
      console.log(e)
      return response.badRequest('Invalid credentials')
    }
  }

  @Mutation((returns) => GraphQLJSON)
  public async signup(
    @Arg('data') data: CreateUserInput,
    @Ctx() { response, auth }: HttpContextContract
  ) {
    const existUser = await User.findBy('email', data.email)

    if (existUser) {
      throw new Error('Email already exist')
    }

    const user = await User.create({
      email: data.email,
      password: data.password,
      role: data.role,
    })

    return await auth.use('web').login(user)
  }
}
