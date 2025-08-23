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

        const token = req.cookies.token as string
        if (!token) {
            throw new BadRequestException({
                message: 'Token ausente.',
                error: 'Token ausente.',
                statusCode: 400
            })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!)
            req['user'] = decoded
            return true
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
                err instanceof jwt.JsonWebTokenError &&
                err.message === 'jwt expired'
            ) {
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
