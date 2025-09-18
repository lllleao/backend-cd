/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = await req.user
        if (user?.userId) {
            return `user-${user.id}`
        }

        // Tenta extrair IP real do cabeçalho
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const forwarded = req.headers['x-forwarded-for']

        if (typeof forwarded === 'string') {
            const ipReal = forwarded.split(',')[0].trim()
            console.log('Dentro do forwarded', `ip-${ipReal}`)
            return `ip-${ipReal}`
        }

        if (req.ip && req.ip !== '127.0.0.1' && req.ip !== '::1') {
            console.log('Fora do forwarded', `ip-${req.ip}`)
            return `ip-${req.ip}`
        }

        // Último fallback: identificador genérico
        return 'anonymous'
    }
}
