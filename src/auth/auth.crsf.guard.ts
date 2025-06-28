import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { verifyCsrfToken } from './utils/csrf.utils'

@Injectable()
export class CrsfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>()

        const token = req.headers['csrf-token'] as string

        if (!token) return false

        return verifyCsrfToken(token)
    }
}
