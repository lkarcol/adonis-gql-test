import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'

import { MiddlewareFn, createMethodDecorator, createParamDecorator } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreatePostInput } from 'App/Inputs/PostInput'

type ValidateSchemaType = ReturnType<typeof schema.create>
type ValidateSchema = ValidateSchemaType | ((ctx: HttpContextContract) => ValidateSchemaType)

export function ValidateInput(s: ValidateSchema) {
  return createMethodDecorator<HttpContextContract>(async ({ args, context }, next) => {
    try {
      await validator.validate({
        schema: typeof s === 'function' ? s(context) : s,
        data: args.data,
      })
      return next()
    } catch (error) {
      return error
    }
  })
}
