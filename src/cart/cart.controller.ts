/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards
} from '@nestjs/common'
import { CrsfGuard } from '../auth/auth.crsf.guard'
import { JwtGuard } from '../auth/auth.jwt.guard'
import { ItemCartDTP, PurchaseDataDTO, UpdataPriceDTO } from './cart.dto'
import { CartService } from './cart.service'
import { Request } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Throttle } from '@nestjs/throttler'

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Post('add')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ login: { ttl: 60000, limit: 30 } })
    async addToCart(@Req() req: Request, @Body() body: ItemCartDTP) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId = req['user'].userId as number
        try {
            return await this.cartService.addToCart(
                userId,
                body.name,
                body.photo,
                body.price,
                body.quant
            )
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new ConflictException(`Item já existe`)
                }
            }
        }
    }

    @Get('items')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ login: { ttl: 60000, limit: 100 } })
    async getItemsCart(@Req() req: Request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId = req['user'].userId as number
        const items = await this.cartService.itemsCart(userId)
        return { items }
    }

    @Delete('delete/:id')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ login: { ttl: 60000, limit: 30 } })
    async deleteItemCart(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId = req['user'].userId as number

        return await this.cartService.delete(id, userId)
    }

    @Get('total-price')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ default: { ttl: 60000, limit: 100 } })
    async getTotalPrice(@Req() req: Request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId = req['user'].userId as number

        return await this.cartService.totalPrice(userId)
    }

    @Patch('update-price')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ login: { ttl: 60000, limit: 30 } })
    async patchTotalPrice(@Req() req: Request, @Body() body: UpdataPriceDTO) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId = req['user'].userId as number
        const { quantCurrent, quantBefore, idItem, price } = body

        return await this.cartService.patchTotalPrice(
            userId,
            quantCurrent,
            quantBefore,
            idItem,
            price
        )
    }

    @Post('create-purchase')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ login: { ttl: 60000, limit: 3 } })
    postCreatePurchse(@Req() req: Request, @Body() body: PurchaseDataDTO) {
        // const userId = req['user'].userId as number

        console.log(body)
    }
}
