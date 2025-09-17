/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { WebHookApiPixService } from './webhoos.service'

@Controller('webhook')
export class WebHookApiPixController {
    constructor(private webHookApiPixService: WebHookApiPixService) {}

    @Post()
    async handleWebHookConfig(@Req() req: Request, @Res() res: Response) {
        console.log('chegou na rota webHook')
        console.log(req.body)

        try {
            const response = await this.webHookApiPixService.checkPayment(
                req.body.pix[0].txid as string
            )
            console.log('Atualização', response)
            res.setHeader('Content-Type', 'text/plain')
            res.status(200).send('200')
        } catch (err) {
            console.log(err)
        }
    }
}
