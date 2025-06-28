import { Injectable } from '@nestjs/common'
import { Options } from 'nodemailer/lib/smtp-transport'
import transporter from 'src/auth/utils/email.transporter'

@Injectable()
export class EmailService {
    async sendEmail(mailOptions: Options) {
        try {
            return await transporter.sendMail(mailOptions)
        } catch (err) {
            console.log(err)
            throw Error('Erro ao enviar email')
        }
    }
}
