/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { TLSSocket } from 'tls'
import * as fs from 'fs'
import * as path from 'path'
import { WebHookApiPixService } from './webhoos.service'

@Controller('webhook')
export class WebHookApiPixController {
    constructor(private webHookApiPixService: WebHookApiPixService) {}

    @Post()
    handleWebHookConfig(@Req() req: Request, @Res() res: Response) {
        console.log('chegou na rota webHook')
        const clientVerify = req.headers['ssl_client_verify']
        console.log('clientVerify: ', clientVerify)
        // const socket = res.socket as TLSSocket
        if (clientVerify === 'SUCCESS') {
            res.status(200).end()
        } else {
            res.status(401).end()
        }
    }

    @Post('pix')
    handleWebhookPix(@Req() req: Request, @Res() res: Response) {
        const socket = res.socket as TLSSocket

        if (socket.authorized) {
            const body = req.body
            const filePath = path.join(__dirname, '..', '..', 'data.json')

            fs.appendFile(filePath, JSON.stringify(body) + '\n', (err) => {
                if (err) {
                    console.error('Erro ao salvar webhook:', err)
                }
                res.status(200).end()
            })
        } else {
            res.status(401).end()
        }
    }

    @Get('teste')
    async configUrlApiPix() {
        await this.webHookApiPixService.configUlr()
    }
}
