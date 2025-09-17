import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { WebHookApiPixService } from './webhoos.service'
import { TLSSocket } from 'tls'

@Controller('webhook')
export class WebHookApiPixController {
    constructor(private webHookApiPixService: WebHookApiPixService) {}

    @Post()
    handleWebHookConfig(@Req() req: Request, @Res() res: Response) {
        console.log('chegou na rota webHook')
        // const clientVerify = req.headers['ssl_client_verify']

        const socket = req.socket as TLSSocket
        console.log('clientVerify: ', req)
        if (socket.authorized) {
            res.status(200).end()
        } else {
            res.status(401).end()
        }
    }
    @Post('pix')
    handleWebhookPix(@Req() req: Request, @Res() res: Response) {
        console.log('chegou na rota pix')
        const clientVerify = req.headers['ssl_client_verify']
        console.log('clientVerify Pix: ', clientVerify)
        // const socket = res.socket as TLSSocket
        if (clientVerify === 'SUCCESS') {
            res.status(200).end()
        } else {
            res.status(401).end()
        }
    }

    @Get('teste')
    async configUrlApiPix() {
        await this.webHookApiPixService.configUlr()
    }
}
