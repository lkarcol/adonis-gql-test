declare module '@ioc:Adonis/Core/Application' {
  import type { ApolloServer } from '@ioc:Apollo/Server'

  export interface ContainerBindings {
    /* eslint-disable @typescript-eslint/naming-convention */
    'Apollo/Server': ApolloServer
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}
