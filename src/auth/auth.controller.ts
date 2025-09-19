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
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { filterSkipThrottler } from '../utils'
import { UserThrottlerGuard } from '../Throttler/user.throttler.guard'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @SkipThrottle(...filterSkipThrottler('getCsrfTokenLimit'))
    @UseGuards(UserThrottlerGuard)
    @Throttle({ getCsrfTokenLimit: { ttl: 60000, limit: 100 } })
    @Post('get-csrfToken')
    getCSRFToken(@Res() res: Response) {
        const token = this.authService.generateCsrfToken()
        return res.status(200).json({ token })
    }

    @SkipThrottle(...filterSkipThrottler('getCookieLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ getCookieLimit: { ttl: 60000, limit: 200 } })
    @Get('get-cookie')
    getCookie() {
        return { success: true }
    }

    @SkipThrottle(...filterSkipThrottler('verifyCsrfTokenLimit'))
    @UseGuards(CrsfGuard, UserThrottlerGuard)
    @Throttle({ verifyCsrfTokenLimit: { ttl: 60000, limit: 200 } })
    @Post('verify-csrfToken')
    getVerifyCsrfToken(@Req() req: Request, @Res() res: Response) {
        console.log('chegou verify-tokey', req)
        console.log('chegou verify-tokey', res)

        return { success: true }
    }

    @SkipThrottle(...filterSkipThrottler('refreshLimit'))
    @UseGuards(CrsfGuard, UserThrottlerGuard)
    @Throttle({ refreshLimit: { ttl: 60000, limit: 5 } })
    @Post('refresh')
    async postRefreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies.refresh as string

        try {
            const { refresh, token } =
                await this.authService.refreshJWT(refreshToken)

            res.cookie('refresh', refresh, {
                path: '/auth/refresh',
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 604800000
            })

            res.cookie('token', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 7200000
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
