import { Module } from '@nestjs/common'
import { WebHookApiPixController } from './webhook.controller'
import { WebHookApiPixService } from './webhoos.service'
import { HttpModule } from '@nestjs/axios'
import { ApiPixService } from '../apiPix/apiPix.service'
import { EmailService } from '../emial/email.service'

@Module({
    imports: [HttpModule],
    controllers: [WebHookApiPixController],
    providers: [WebHookApiPixService, ApiPixService, EmailService]
})
export class WebHookApiPixModule {}
