import { NonEmptyArray } from 'type-graphql'
import ApolloServer from './ApolloServer'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { GqlSessionActivator } from '../../app/Middleware/GqlSession'
import { AuthGuard } from 'App/Middleware/AuthGuard'

class ApolloTypeGraphql {
  private apolloServer: ApolloServer | null = null

  public async makeSchemaFromTypeGraphqlResolvers(
    app: ApplicationContract,
    resolvers: NonEmptyArray<Function>
  ) {
    const buildSchema = (await import('type-graphql')).buildSchema

    const schema = await buildSchema({
      resolvers,
      globalMiddlewares: [GqlSessionActivator],
      emitSchemaFile: {
        path: 'App/Schemas/schema.graphql',
        sortedSchema: false,
      },
      authChecker: AuthGuard,
    })

    this.apolloServer = new ApolloServer(app, {
      schemas: schema,
      context: ({ ctx }) => ctx,
    })
    return this.apolloServer
  }

  public start() {
    this.apolloServer?.start()
  }

  public createGraphqlEndpoint() {
    try {
      this.apolloServer?.applyMiddleware()
    } catch (error) {
      console.log(error)
    }
  }
}

export default ApolloTypeGraphql
