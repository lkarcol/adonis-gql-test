import { ApolloServer as ApolloServerBase, type BaseContext } from '@apollo/server'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ApolloConfig, ContextFn } from '@ioc:Apollo/Server'

import { graphqlAdonis } from './graphqlAdonis'
import Schema from './Schema'

const defaultContextFn: ContextFn = () => ({})

export default class ApolloServer<ContextType extends BaseContext = BaseContext> {
  private $apolloServer: ApolloServerBase<ContextType>
  private $contextFunction: ContextFn<ContextType>

  private $app: ApplicationContract

  private $path: string

  constructor(application: ApplicationContract, config: ApolloConfig<ContextType>) {
    this.init(application, config)
  }

  public async init(application: ApplicationContract, config: ApolloConfig<ContextType>) {
    this.$app = application
    this.$path = config.path ?? '/graphql'
    this.$contextFunction = config.context ?? (defaultContextFn as ContextFn<ContextType>)

    const schema = await Schema.make(config)
    this.makeApolloServer(schema, config)
  }

  private makeApolloServer(schema, config: ApolloConfig<ContextType>) {
    this.$apolloServer = new ApolloServerBase<ContextType>({
      ...schema,
      plugins: [
        this.$app.env.get('NODE_ENV') === 'production'
          ? // eslint-disable-next-line new-cap
            ApolloServerPluginLandingPageProductionDefault({
              footer: false,
              ...config.apolloProductionLandingPageOptions,
            })
          : // eslint-disable-next-line new-cap
            ApolloServerPluginLandingPageLocalDefault({
              footer: false,
              ...config.apolloLocalLandingPageOptions,
            }),
      ],
      ...config.apolloServer,
    })

    this.$apolloServer.start()
  }

  public applyMiddleware(): void {
    const Route = this.$app.container.resolveBinding('Adonis/Core/Route')
    Route.get(this.$path, this.getGraphqlHandler())
    Route.post(this.$path, this.getGraphqlHandler())
  }

  public getGraphqlHandler() {
    return async (ctx: HttpContextContract) => {
      return graphqlAdonis(this.$apolloServer, this.$contextFunction, ctx)
    }
  }

  public start() {
    return this.$apolloServer.start()
  }

  public stop() {
    return this.$apolloServer.stop()
  }
}
