import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException
} from '@nestjs/common'
import { Request } from 'express'
import { verifyCsrfToken } from './utils/csrf.utils'

@Injectable()
export class CrsfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>()

        const token = req.headers['csrf-token'] as string
        if (!token) {
            console.log('Sem o csrfToken')
            throw new ForbiddenException({
                message: 'CSRF token ausente no cabeçalho da requisição.',
                statusCode: 403,
                error: 'CSRF Token Missing'
            })
        }

        const isValid = verifyCsrfToken(token)

        if (!isValid) {
            console.log('O csrfToken não é válido')
            throw new ForbiddenException({
                message: 'CSRF token inválido ou expirado.',
                statusCode: 403,
                error: 'CSRF Token Invalid'
            })
        }

        return isValid
    }
}
