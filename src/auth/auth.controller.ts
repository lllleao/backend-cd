import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtGuard } from './auth.jwt.guard'
import { CrsfGuard } from './auth.crsf.guard'
import { Response } from 'express'

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
}
