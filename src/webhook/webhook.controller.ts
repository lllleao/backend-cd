/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Controller,
    InternalServerErrorException,
    Post,
    Req,
    Res
} from '@nestjs/common'
import { Request, Response } from 'express'
import { WebHookApiPixService } from './webhoos.service'

@Controller('webhook')
export class WebHookApiPixController {
    constructor(private webHookApiPixService: WebHookApiPixService) {}

    @Post()
    async handleWebHookConfig(@Req() req: Request, @Res() res: Response) {
        console.log('chegou na rota webHook')

        try {
            await this.webHookApiPixService.checkPayment(
                req.body.pix[0].txid as string
            )
            res.setHeader('Content-Type', 'text/plain')
            res.status(200).send('200')
        } catch (err) {
            throw new InternalServerErrorException({
                message: 'Erro ao enviar e-mail.',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                error: err.message || err
            })
        }
    }
}
