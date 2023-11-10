import { ApolloServer as ApolloServerBase, type BaseContext } from '@apollo/server'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { LoggerContract } from '@ioc:Adonis/Core/Logger'
import type { ApolloConfig, ContextFn } from '@ioc:Zakodium/Apollo/Server'

import { graphqlAdonis } from './graphqlAdonis'

const defaultContextFn: ContextFn = () => ({})

export default class ApolloServer<ContextType extends BaseContext = BaseContext> {
  private $apolloServer: ApolloServerBase<ContextType>
  private $contextFunction: ContextFn<ContextType>

  private $app: ApplicationContract

  private $path: string

  constructor(
    application: ApplicationContract,
    config: ApolloConfig<ContextType>
    //logger: LoggerContract
  ) {
    const {
      path: graphQLPath = '/graphql',
      schemas,
      apolloServer = {},
      apolloProductionLandingPageOptions,
      apolloLocalLandingPageOptions,
      context = defaultContextFn as ContextFn<ContextType>,
      executableSchema = {},
    } = config

    this.$app = application

    this.$path = graphQLPath

    this.$contextFunction = context

    if (application.inDev) {
      //printWarnings(warnings, logger)
    }

    this.$apolloServer = new ApolloServerBase<ContextType>({
      schema: schemas,
      plugins: [
        this.$app.env.get('NODE_ENV') === 'production'
          ? // eslint-disable-next-line new-cap
            ApolloServerPluginLandingPageProductionDefault({
              footer: false,
              ...apolloProductionLandingPageOptions,
            })
          : // eslint-disable-next-line new-cap
            ApolloServerPluginLandingPageLocalDefault({
              footer: false,
              ...apolloLocalLandingPageOptions,
            }),
      ],
      ...apolloServer,
    })
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
