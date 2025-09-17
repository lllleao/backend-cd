/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ApiPixService } from './apiPix.service'
import { CrsfGuard } from '../auth/auth.crsf.guard'
import { JwtGuard } from '../auth/auth.jwt.guard'

@Controller('api-pix')
export class ApiPixController {
    constructor(private apiPixService: ApiPixService) {}

    @UseGuards(CrsfGuard, JwtGuard)
    @Get('pay-pix')
    async payWithPix(@Req() req: Request) {
        const userId = req['user'].userId as number
        try {
            return await this.apiPixService.getPendingPurchase(userId)
        } catch (err) {
            console.log(err)
        }
    }

    @UseGuards(CrsfGuard, JwtGuard)
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
