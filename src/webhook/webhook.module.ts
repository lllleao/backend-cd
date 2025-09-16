import { Module } from '@nestjs/common'
import { WebHookApiPixController } from './webhook.controller'
import { WebHookApiPixService } from './webhoos.service'
import { HttpModule } from '@nestjs/axios'
import { ApiPixService } from '../apiPix/apiPix.service'

@Module({
    imports: [HttpModule],
    controllers: [WebHookApiPixController],
    providers: [WebHookApiPixService, ApiPixService]
})
export class WebHookApiPixModule {}
