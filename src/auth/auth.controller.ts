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

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('get-csrfToken')
    getCSRFToken(@Res() res: Response) {
        const token = this.authService.generateCsrfToken()
        return res.status(200).json({ token })
    }

    @Get('get-cookie')
    @UseGuards(CrsfGuard, JwtGuard)
    getCookie() {
        return { success: true }
    }

    @Post('verify-csrfToken')
    @UseGuards(CrsfGuard)
    getVerifyCsrfToken() {
        return { success: true }
    }

    @Post('refresh')
    @UseGuards(CrsfGuard)
    async postRefreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies.refresh as string

        try {
            const token = await this.authService.refreshJWT(refreshToken)

            res.cookie('token', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax', // none
                // secure: true, TROCAR PARA ALKGO SEGURO DEPOIS
                maxAge: 3600000
            })

            return res.status(200).json({ msg: 'Token atualizado' })
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log('Token mal formado', err.message)
                throw new BadRequestException({
                    message: 'Token mal formado',
                    error: 'Token mal formado',
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
