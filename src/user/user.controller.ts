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
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { filterSkipThrottler } from '../utils'
import { UserThrottlerGuard } from '../Throttler/user.throttler.guard'
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @SkipThrottle(...filterSkipThrottler('signupLimit'))
    @UseGuards(CrsfGuard, UserThrottlerGuard)
    @Throttle({ signupLimit: { ttl: 60000, limit: 5 } })
    @Post('signup')
    async signup(@Req() req: Request, @Body() body: SignupDTO) {
        const { email, name, password } = body
        const token = req.cookies.token as string

        if (token) {
            throw new BadRequestException('Usuário já logado')
        }

        return await this.userService.createUser(password, email, name)
    }

    @SkipThrottle(...filterSkipThrottler('loginLimit'))
    @UseGuards(CrsfGuard, UserThrottlerGuard)
    @Throttle({ loginLimit: { ttl: 60000, limit: 5 } })
    @Post('login')
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

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 3600000
        })

        res.cookie('refresh', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 604800000
        })
        return res.status(200).json({ success: true })
    }

    @SkipThrottle(...filterSkipThrottler('profileLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ profileLimit: { ttl: 60000, limit: 100 } })
    @Get('profile')
    async getProfileData(@Req() req: Request) {
        const profileData = await this.userService.profileData(
            req['user'].userId as number
        )
        return profileData
    }

    @SkipThrottle(...filterSkipThrottler('logoutLimit'))
    @UseGuards(CrsfGuard, UserThrottlerGuard)
    @Throttle({ logoutLimit: { ttl: 60000, limit: 5 } })
    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('token', {
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        res.clearCookie('refresh', {
            path: '/auth/refresh',
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        res.status(200).json({ msg: 'Logout realizado' })
    }

    @SkipThrottle(...filterSkipThrottler('createAddressLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ createAddressLimit: { ttl: 60000, limit: 10 } })
    @Post('create-address')
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

    @SkipThrottle(...filterSkipThrottler('getAddressLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ getAddressLimit: { ttl: 60000, limit: 200 } })
    @Get('get-address')
    async getAddress(@Req() req: Request) {
        const userId = req['user'].userId as number
        return await this.userService.addressUser(userId)
    }
}
