import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtGuard } from './auth.jwt.guard'
import { CrsfGuard } from './auth.crsf.guard'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('get-csrfToken')
    getCSRFToken() {
        const token = this.authService.generateCsrfToken()
        return { csrfToken: token }
    }

    @Get('get-cookie')
    @UseGuards(CrsfGuard, JwtGuard)
    getCookie() {
        return { success: true }
    }
}
