import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import {
    generateJWTToken,
    generateRefreshJWTToken
} from '../auth/utils/jwt.utils'
import { EmailService } from '../emial/email.service'
import { CreateAddressDto } from './user.dto'

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private emailService: EmailService
    ) {}
    async createUser(
        password: string,
        email: string,
        name: string
    ): Promise<{ signSuccess: boolean }> {
        try {
            const userExist = await this.prismaService.user_cd.findUnique({
                where: {
                    email
                }
            })
            if (userExist) {
                throw new BadRequestException('Este email já está em uso.')
            }

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            const user = await this.prismaService.user_cd.create({
                data: {
                    email,
                    name,
                    passwordUser: hash,
                    isVerified: false
                }
            })

            const token = await generateJWTToken('20m', email, user.id)

            await this.prismaService.user_cd.update({
                where: { id: user.id },
                data: {
                    token
                }
            })

            await this.prismaService.cart.create({
                data: {
                    userId: user.id,
                    emailUser: user.email
                }
            })

            if (!token) {
                throw new InternalServerErrorException(
                    'Falha ao gerar token de confirmação.'
                )
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Confirmação de email',
                html: `<h2>Clique no link para confirmar seu email: <a href="http://localhost:3000/email/confirm?token=${token}">Confirmar Email</a></h2>`
            }

            await this.emailService.sendEmail(mailOptions)

            return { signSuccess: true }
        } catch (err) {
            if (err instanceof BadRequestException) throw err

            console.error('Erro interno ao criar usuário:', err)
            throw new InternalServerErrorException(
                'Erro interno ao criar usuário.'
            )
        }
    }

    async login(
        email: string,
        password: string
    ): Promise<{ token: string; refreshToken: string }> {
        const user = await this.prismaService.user_cd.findUnique({
            where: {
                email
            }
        })

        if (user && !user.isVerified) {
            throw new BadRequestException('Email não verificado.')
        }

        if (!user) {
            throw new BadRequestException('Usuário não existe.')
        }

        const isPassword = await bcrypt.compare(password, user?.passwordUser)
        if (!isPassword) {
            throw new ForbiddenException({
                message: 'Senha incorreta.',
                statusCode: 403,
                error: 'Senha incorreta'
            })
        }

        const token = await generateJWTToken('2h', user?.email, user?.id)
        const refreshToken = await generateRefreshJWTToken(
            '7d',
            user?.email,
            user?.id
        )

        return { token, refreshToken }
    }

    async profileData(user_id: number) {
        const user = await this.prismaService.user_cd.findUnique({
            where: {
                id: user_id
            }
        })

        return {
            email: user?.email,
            name: user?.name,
            dataPurchase: []
        }
    }

    async createAddress(
        { userId }: { userId: number },
        {
            data: {
                cpf,
                isDefault,
                neighborhood,
                number,
                street,
                zipCode,
                complement,
                name
            }
        }: CreateAddressDto
    ) {
        const existingAddress = await this.prismaService.address.findMany({
            where: {
                userId
            }
        })

        if (existingAddress.length) {
            const addressToReplace = isDefault
                ? existingAddress.find((add) => add.isDefault)
                : existingAddress.find((addr) => !addr.isDefault)

            if (!addressToReplace) {
                return await this.prismaService.address.create({
                    data: {
                        neighborhood,
                        number,
                        street,
                        zipCode,
                        complement,
                        isDefault,
                        userId,
                        cpf,
                        name
                    }
                })
            }

            return await this.prismaService.address.update({
                where: {
                    id: Number(addressToReplace?.id)
                },
                data: {
                    complement,
                    cpf,
                    isDefault,
                    neighborhood,
                    number,
                    street,
                    zipCode,
                    name
                }
            })
        }

        return await this.prismaService.address.create({
            data: {
                neighborhood,
                number,
                street,
                zipCode,
                complement,
                isDefault,
                userId,
                cpf,
                name
            }
        })
    }

    async addressUser(userId: number) {
        return await this.prismaService.address.findMany({
            where: {
                userId
            }
        })
    }
}
