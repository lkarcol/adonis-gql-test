declare module '@ioc:Apollo/Server' {
  import { AuthChecker } from 'type-graphql'
  import { Middleware } from 'type-graphql/build/typings/typings/Middleware'
  import type { ApolloServerOptions, BaseContext, ContextFunction } from '@apollo/server'
  import {
    ApolloServerPluginLandingPageLocalDefaultOptions,
    ApolloServerPluginLandingPageProductionDefaultOptions,
  } from '@apollo/server/plugin/landingPage/default'
  import type { IExecutableSchemaDefinition } from '@graphql-tools/schema'

  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import type { RouteHandler, RouteMiddlewareHandler } from '@ioc:Adonis/Core/Route'

  class ApolloServer {
    public applyMiddleware(): void
    public getGraphqlHandler(): RouteHandler
    public start(): Promise<void>
    public stop(): Promise<void>
  }

  export type { ApolloServer }
  export type { BaseContext } from '@apollo/server'

  export interface ContextFnArgs {
    ctx: HttpContextContract
  }

  export type ContextFn<ContextType extends BaseContext = BaseContext> = (
    args: ContextFnArgs
  ) => ContextType | Promise<ContextType>

  const server: ApolloServer
  export default server

  export interface ApolloConfig<ContextType extends BaseContext = BaseContext> {
    resolvers?: string
    path?: string
    appUrl?: string

    apolloServer?: Omit<
      ApolloServerOptions<ContextType>,
      'schema' | 'resolvers' | 'typeDefs' | 'gateway'
    >

    apolloProductionLandingPageOptions?: ApolloServerPluginLandingPageProductionDefaultOptions
    apolloLocalLandingPageOptions?: ApolloServerPluginLandingPageLocalDefaultOptions

    context?: ContextFn

    executableSchema?: Omit<IExecutableSchemaDefinition, 'typeDefs' | 'resolvers'>

    typeGraphql?: {
      authChecker?: AuthChecker
      globalMiddlewares?: Middleware[]
    }
  }
}
