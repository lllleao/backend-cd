import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthenticatedRequest } from 'src/common/types'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

        const token = req.cookies?.jwt

        if (!token) return false

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!)
            req['user'] = decoded
            return true
        } catch {
            return false
        }
    }
}
