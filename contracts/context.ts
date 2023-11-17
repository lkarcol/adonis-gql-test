import { DataloaderType, DataloderService } from 'App/Decorators/Dataloder'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    dataloader: { [key in string]: DataloderService } | null
  }
}
