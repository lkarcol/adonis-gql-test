declare module '@ioc:Adonis/Core/Application' {
  import type { ApolloServer } from '@ioc:Zakodium/Apollo/Server'
  import type { ApolloTypeGraphql } from '@ioc:ApolloTypeGraphql'

  export interface ContainerBindings {
    /* eslint-disable @typescript-eslint/naming-convention */
    'Zakodium/Apollo/Server': ApolloServer
    'ApolloTypeGraphql': ApolloTypeGraphql
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}
