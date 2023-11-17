import { createParamDecorator } from 'type-graphql'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataLoader from 'dataloader'

type BatchFn<T, K> = DataLoader.BatchLoadFn<T, K>
export type DataloaderType = <T, K>(batchFn: BatchFn<T, K>) => any

export class DataloderService {
  private dataLoader: any | null = null

  public getDataloder<T, K>(batchFn: BatchFn<T, K>) {
    if (this.dataLoader) {
      return this.dataLoader
    }
    this.dataLoader = new DataLoader(batchFn)
    return this.dataLoader
  }
}

export default function GetDataloader(name: string) {
  return createParamDecorator<HttpContextContract>(({ args, context }): DataloderService => {
    const { dataloader } = context

    if (dataloader && dataloader[name]) {
      return dataloader[name]
    }

    context.dataloader = {
      ...context.dataloader,
      [name]: new DataloderService(),
    }

    return context.dataloader[name]
  })
}
