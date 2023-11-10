import * as fs from 'fs'
import * as path from 'path'
import { ApolloConfig } from '@ioc:Apollo/Server'
import { NonEmptyArray, buildSchema } from 'type-graphql'

class Schema {
  public static async make(config: ApolloConfig) {
    const resolversPath: string = config.resolvers ?? ''

    const resolversModules = await this.loadResolvers(resolversPath)

    if (resolversModules.length === 0) {
      throw new Error('No valid resolvers found.')
    }

    const schema = await buildSchema({
      resolvers: resolversModules as NonEmptyArray<Function>,
      ...config.typeGraphql,
    })

    return {
      schema,
    }
  }

  private static async loadResolvers(folderPath: string) {
    const resolvers: Function[] = []

    const files = await fs.promises.readdir(folderPath)

    for (const file of files) {
      const filePath = path.join(folderPath, file)

      const isDirectory = (await fs.promises.stat(filePath)).isDirectory()

      if (isDirectory) {
        resolvers.push(...(await this.loadResolvers(filePath)))
      } else if (file.endsWith('.js') || file.endsWith('.ts')) {
        const resolverModule = await import(filePath)

        if (resolverModule.default) {
          resolvers.push(resolverModule.default)
        }
      }
    }

    return resolvers
  }
}

export default Schema
