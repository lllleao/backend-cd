import { Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('get-csrfToken')
    getCSRFToken() {
        const token = this.authService.generateCsrfToken()
        return { csrfToken: token }
    }
}
