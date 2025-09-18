/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ApiPixService } from './apiPix.service'
import { CrsfGuard } from '../auth/auth.crsf.guard'
import { JwtGuard } from '../auth/auth.jwt.guard'
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { filterSkipThrottler } from '../utils'
import { UserThrottlerGuard } from '../Throttler/user.throttler.guard'

@Controller('api-pix')
export class ApiPixController {
    constructor(private apiPixService: ApiPixService) {}

    @SkipThrottle(...filterSkipThrottler('payPixLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ payPixLimit: { ttl: 60000, limit: 5 } })
    @Get('pay-pix')
    async payWithPix(@Req() req: Request) {
        const userId = req['user'].userId as number
        try {
            return await this.apiPixService.getPendingPurchase(userId)
        } catch (err) {
            console.log(err)
        }
    }

    @SkipThrottle(...filterSkipThrottler('isPaidLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ isPaidLimit: { ttl: 60000, limit: 10 } })
    @Get('is-paid')
    async isPaid(@Req() req: Request) {
        const userId = req['user'].userId as number
        try {
            return await this.apiPixService.getIsPaid(userId)
        } catch (err) {
            console.log(err)
        }
    }
}
