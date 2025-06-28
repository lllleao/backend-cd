import {
    Body,
    Controller,
    HttpException,
    Post,
    UseGuards
} from '@nestjs/common'
import { CrsfGuard } from 'src/auth/auth.crsf.guard'
import { ContactDto } from 'src/auth/contact.dto'
import { EmailService } from './email.service'

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) {}

    @Post('send')
    @UseGuards(CrsfGuard)
    async sendEmail(@Body() emailInfo: ContactDto): Promise<any> {
        const { emailUser, name, text, number } = emailInfo

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: emailUser,
            subject: 'Contato site',
            html: `<h2>${name} - ${emailUser}</h2><br/><br/><h3>${text}</h3><br/><h4>Telefone: ${number}</h4>`
        }

        try {
            await this.emailService.sendEmail(mailOptions)

            return {
                statusCode: 200,
                message: 'E-mail enviado com sucesso.'
            }
        } catch (err) {
            throw new HttpException(
                {
                    statusCode: 500,
                    message: 'Erro ao enviar e-mail.',
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    error: err.message || err
                },
                500
            )
        }
    }
}
