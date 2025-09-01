import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Query,
    Res,
    UseGuards
} from '@nestjs/common'
import { CrsfGuard } from '../auth/auth.crsf.guard'
import { ContactDto } from '../emial/contact.dto'
import { EmailService } from './email.service'
import { Response } from 'express'
import results from './utils/confirm.utils'
import { join } from 'path'
import { formatPhoneNumber } from '../auth/utils/formatPhone'

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) {}

    @Post('send')
    @UseGuards(CrsfGuard)
    async postSendEmail(@Body() emailInfo: ContactDto): Promise<any> {
        const { emailUser, name, text, phone } = emailInfo
        const phoneFormated = formatPhoneNumber(phone)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: emailUser,
            subject: 'Contato site',
            html: `<h2>${name} - ${emailUser}</h2><br/><br/><h3>${text}</h3><br/><h4>Telefone: ${phoneFormated}</h4>`
        }

        try {
            await this.emailService.sendEmail(mailOptions)
            return {
                statusCode: 200,
                message: 'E-mail enviado com sucesso.'
            }
        } catch (err) {
            console.error('Erro ao enviar e-mail.', err)
            throw new InternalServerErrorException({
                message: 'Erro ao enviar e-mail.',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                error: err.message || err
            })
        }
    }

    @Get('confirm')
    async getConfirmEmail(@Res() res: Response, @Query('token') token: string) {
        try {
            const resultEmail = await this.emailService.confirmEmail(token)

            const handler = results[resultEmail.result]
            handler(res)
        } catch {
            return res.sendFile(
                join(
                    __dirname,
                    '..',
                    '..',
                    'public',
                    'tokenExpire',
                    'index.html'
                )
            )
        }
    }
}
