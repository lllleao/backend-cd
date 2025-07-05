import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable
} from '@nestjs/common'
import { AuthenticatedRequest } from 'src/common/types'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

        const token: { token: string } = req.cookies.token as { token: string }
        if (!token) {
            throw new BadRequestException({
                message: 'Token ausente.',
                error: 'Token ausente.',
                statusCode: 400
            })
        }

        try {
            const decoded = jwt.verify(token.token, process.env.JWT_SECRET!)
            req['user'] = decoded
            return true
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log('Token mal formado', err.message)
                throw new BadRequestException({
                    message: 'Token mal formado',
                    error: 'Token mal formado',
                    statusCode: 400
                })
            } else if (err instanceof jwt.TokenExpiredError) {
                console.log('Token expirado:', err.message)
                throw new BadRequestException({
                    message: 'Token expirado',
                    error: 'Token expirado',
                    statusCode: 400
                })
            } else {
                console.log('Erro desconhecido:', err)
            }
            return false
        }
    }
}
