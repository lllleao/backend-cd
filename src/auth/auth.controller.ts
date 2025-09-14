import {
    BadRequestException,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtGuard } from './auth.jwt.guard'
import { CrsfGuard } from './auth.crsf.guard'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { Throttle } from '@nestjs/throttler'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('get-csrfToken')
    // @Throttle({ csrfToken: { ttl: 60000, limit: 50 } })
    getCSRFToken(@Res() res: Response) {
        const token = this.authService.generateCsrfToken()
        return res.status(200).json({ token })
    }

    @Get('get-cookie')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ csrfToken: { ttl: 60000, limit: 50 } })
    getCookie() {
        return { success: true }
    }

    @Post('verify-csrfToken')
    @UseGuards(CrsfGuard)
    // @Throttle({ csrfToken: { ttl: 60000, limit: 60 } })
    getVerifyCsrfToken() {
        return { success: true }
    }

    @Post('refresh')
    @UseGuards(CrsfGuard)
    @Throttle({ csrfToken: { ttl: 60000, limit: 5 } })
    async postRefreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies.refresh as string

        try {
            const { refresh, token } =
                await this.authService.refreshJWT(refreshToken)
            const isProduction = process.env.PRODUCTION === 'production'

            res.cookie('refresh', refresh, {
                path: '/auth/refresh',
                httpOnly: true,
                sameSite: isProduction ? 'none' : 'lax',
                secure: isProduction,
                maxAge: 604800000,
                domain: isProduction ? '64.181.171.109' : undefined
            })

            res.cookie('token', token, {
                path: '/',
                httpOnly: true,
                sameSite: isProduction ? 'none' : 'lax',
                secure: isProduction,
                maxAge: 3600000,
                domain: isProduction ? '64.181.171.109' : undefined
            })

            return res.status(200).json({ msg: 'Token atualizado' })
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
                throw new BadRequestException({
                    message: 'Token expirado',
                    error: 'Token expirado',
                    statusCode: 400
                })
            } else {
                throw new BadRequestException({
                    message: 'Erro desconhecido',
                    error: 'Erro desconhecido',
                    statusCode: 400
                })
            }
        }
    }
}
