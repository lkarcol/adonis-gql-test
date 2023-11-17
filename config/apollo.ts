import { join } from 'path'
import { ApolloConfig } from '@ioc:Apollo/Server'
import { AuthGuard } from 'App/Middleware/AuthGuard'
import { GqlSessionActivator } from 'App/Middleware/GqlSession'

/*
  |--------------------------------------------------------------------------
  | GraphQL Config
  |--------------------------------------------------------------------------
  |
  | You can overrided the default config resolver path
  |
*/

export default {
  resolvers: join(__dirname, '../app/Resolvers'),
  context: ({ ctx }) => {
    ctx.dataloader = null
    return ctx
  },
  typeGraphql: {
    authChecker: AuthGuard,
    globalMiddlewares: [GqlSessionActivator],
  },
} as ApolloConfig
