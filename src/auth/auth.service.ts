import { Injectable } from '@nestjs/common'
import { generateCsrfToken } from './utils/csrf.utils'

@Injectable()
export class AuthService {
    generateCsrfToken() {
        const { token } = generateCsrfToken()
        // console.log('')
        return token
    }
}
