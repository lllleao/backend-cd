import { Injectable } from '@nestjs/common'
import { generateCsrfToken } from './utils/csrf.utils'
import * as jwt from 'jsonwebtoken'
import { generateJWTToken } from './utils/jwt.utils'

@Injectable()
export class AuthService {
    generateCsrfToken() {
        const { token } = generateCsrfToken()
        return token
    }

    async refreshJWT(refreshToken: string) {
        const secret = process.env.JWT_REFRESH_SECRET as string
        const { email, userId } = jwt.verify(refreshToken, secret) as {
            email: string
            userId: number
        }
        const token = await generateJWTToken('30m', email, userId)
        return token
    }
}
