/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common'
import { CreateAddressDto, LoginDTO, SignupDTO } from './user.dto'
import { UserService } from './user.service'
import { CrsfGuard } from '../auth/auth.crsf.guard'
import { Request, Response } from 'express'
import { JwtGuard } from '../auth/auth.jwt.guard'
import * as jwt from 'jsonwebtoken'
import { checkTokenFront } from './utils/user.utils'
import { Throttle } from '@nestjs/throttler'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    @UseGuards(CrsfGuard)
    @Throttle({ login: { ttl: 60000, limit: 5 } })
    async signup(@Req() req: Request, @Body() body: SignupDTO) {
        const { email, name, password } = body
        const token = req.cookies.token as string

        if (token) {
            throw new BadRequestException('Usuário já logado')
        }

        return await this.userService.createUser(password, email, name)
    }

    @Post('login')
    @UseGuards(CrsfGuard)
    @Throttle({ login: { ttl: 60000, limit: 5 } })
    async login(
        @Body() body: LoginDTO,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { email, password } = body
        const tokenFrontend = req.cookies.token as string

        if (checkTokenFront(tokenFrontend)) {
            try {
                jwt.verify(tokenFrontend, process.env.JWT_SECRET!)
                return res.status(400).json({ message: 'Usuário já logado' })
            } catch (err) {
                if (
                    err instanceof jwt.JsonWebTokenError &&
                    !(err.message === 'jwt expired')
                ) {
                    throw new BadRequestException({
                        message: 'Token mal formado',
                        error: 'Token mal formado',
                        statusCode: 400
                    })
                } else if (
                    err instanceof jwt.TokenExpiredError &&
                    err.message === 'jwt expired'
                ) {
                    console.log('Token expirado:', err.message)
                } else {
                    console.log('Erro desconhecido:', err)
                }
            }
        }

        const { token, refreshToken } = await this.userService.login(
            email,
            password
        )

        const isProduction = process.env.PRODUCTION === 'production'
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 3600000,
            domain: isProduction ? '64.181.171.109' : undefined
        })

        res.cookie('refresh', refreshToken, {
            path: '/auth/refresh',
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            maxAge: 604800000,
            domain: isProduction ? '64.181.171.109' : undefined
        })
        return res.status(200).json({ success: true })
    }

    @Get('profile')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ default: { ttl: 60000, limit: 100 } })
    async getProfileData(@Req() req: Request) {
        const profileData = await this.userService.profileData(
            req['user'].userId as number
        )
        return profileData
    }

    @Post('logout')
    @UseGuards(CrsfGuard)
    @Throttle({ login: { ttl: 60000, limit: 5 } })
    logout(@Res() res: Response) {
        res.clearCookie('token')
        res.clearCookie('refresh')

        res.status(200).json({ msg: 'Logout realizado' })
    }

    @Post('create-address')
    @Throttle({ login: { ttl: 60000, limit: 10 } })
    @UseGuards(CrsfGuard, JwtGuard)
    async postCreateAddress(
        @Req() req: Request,
        @Body() body: CreateAddressDto
    ) {
        const userId = req['user'].userId as number
        const {
            cpf,
            isDefault,
            neighborhood,
            number,
            street,
            zipCode,
            complement,
            name
        } = body.data

        await this.userService.createAddress(
            { userId },
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
            }
        )

        return { success: true }
    }

    @Get('get-address')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ default: { ttl: 60000, limit: 200 } })
    async getAddress(@Req() req: Request) {
        const userId = req['user'].userId as number
        return await this.userService.addressUser(userId)
    }
}
