import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    catch(exception: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const req = ctx.getRequest()

        // tenta pegar o tempo restante, se disponível
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const retryAfter = (exception as any).ttl ?? 60 // TTL padrão fallback

        response.status(429).json({
            statusCode: 429,
            error: 'Too Many Requests',
            message: 'Você atingiu o limite de requisições.',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            retryAfterSeconds: retryAfter,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            path: req.url
        })
    }
}
