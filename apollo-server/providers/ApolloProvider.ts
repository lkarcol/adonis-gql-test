import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import ApolloServer from '../src/ApolloServer'
import { ApolloConfig } from '@ioc:Apollo/Server'

export default class ApolloProvider {
  protected loading = false
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public register(): void {
    this.app.container.singleton('Apollo/Server', () => {
      if (this.loading) {
        throw new Error(
          'ApolloProvider was called during its initialization. To use this provider in resolvers, use dynamic `import()`.'
        )
      }
      let apolloConfig = this.app.config.get('apollo', {}) as ApolloConfig

      this.loading = true
      return new ApolloServer(this.app, apolloConfig)
    })
  }

  public async boot(): Promise<void> {
    /*  const service = this.app.container.resolveBinding('ApolloTypeGraphql')

    const AuthResolver = (await import('App/Resolvers/AuthResolver')).default
    const UserResolver = (await import('App/Resolvers/UserResolver')).default
    const PostResolver = (await import('App/Resolvers/PostResolver')).default
    const resolvers = [AuthResolver, UserResolver, PostResolver]
    await service.makeSchemaFromTypeGraphqlResolvers(this.app, resolvers)
    service.start()*/
  }

  public async ready() {}

  public async shutdown(): Promise<void> {
    // await this.app.container.resolveBinding('Zakodium/Apollo/Server').stop()
  }
}
