/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, any>): Promise<string> {
        // req.user deve estar populado pelo JWT guard
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = await req.user
        if (user?.id) {
            return `user-${user.id}`
        }

        // fallback para IP
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return req.ip
    }
}
