import { Injectable } from '@nestjs/common'
import SMTPTransport, { Options } from 'nodemailer/lib/smtp-transport'
import transporter from 'src/auth/utils/email.transporter'
import verifyJwtToken from './utils/email.veriryJWT'
import { PrismaService } from 'src/prisma/prisma.service'
import { ResultKeys } from './utils/confirm.utils'

@Injectable()
export class EmailService {
    constructor(private prismaService: PrismaService) {}
    async sendEmail(
        mailOptions: Options
    ): Promise<Promise<SMTPTransport.SentMessageInfo>> {
        return await transporter.sendMail(mailOptions)
    }

    async confirmEmail(token: string): Promise<{ result: ResultKeys }> {
        const { userId } = await verifyJwtToken(token)
        const user = await this.prismaService.user_cd.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return { result: 'userExist' }
        }

        if (user.token !== token && user.isVerified) {
            return { result: 'accountVerified' }
        }

        await this.prismaService.user_cd.update({
            where: { id: userId },
            data: {
                token: null,
                isVerified: true
            }
        })
        return { result: 'success' }
    }
}
