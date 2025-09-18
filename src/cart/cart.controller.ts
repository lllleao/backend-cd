/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
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
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { filterSkipThrottler } from '../utils'
import { UserThrottlerGuard } from '../Throttler/user.throttler.guard'

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @SkipThrottle(...filterSkipThrottler('addLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ addLimit: { ttl: 60000, limit: 30 } })
    @Post('add')
    async addToCart(@Req() req: Request, @Body() body: ItemCartDTP) {
        const userId = req['user'].userId as number
        try {
            return await this.cartService.addToCart(
                userId,
                body.name,
                body.photo,
                body.price,
                body.quant,
                body.id,
                body.stock
            )
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new ConflictException(`Item já existe`)
                }
            }
        }
    }

    @SkipThrottle(...filterSkipThrottler('itemsLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ itemsLimit: { ttl: 60000, limit: 200 } })
    @Get('items')
    async getItemsCart(@Req() req: Request) {
        const userId = req['user'].userId as number
        const items = await this.cartService.itemsCart(userId)

        return { items }
    }

    @SkipThrottle(...filterSkipThrottler('deleteLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ deleteLimit: { ttl: 60000, limit: 30 } })
    @Delete('delete/:id')
    async deleteItemCart(@Param('id', ParseIntPipe) id: number) {
        return await this.cartService.delete(id)
    }

    @SkipThrottle(...filterSkipThrottler('deleteAllLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ deleteAllLimit: { ttl: 60000, limit: 30 } })
    @Delete('delete-all')
    async deleteAllItemCart(@Req() req: Request) {
        const userId = req['user'].userId as number

        try {
            await this.cartService.deleteAllItems(userId)
            return { success: true }
        } catch (err) {
            console.log(err)
            throw new BadRequestException({
                message: 'Itens não foram deletados',
                error: 'Itens não foram deletados',
                statusCode: 400
            })
        }
    }

    @SkipThrottle(...filterSkipThrottler('updatePriceLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ updatePriceLimit: { ttl: 60000, limit: 200 } })
    @Patch('update-price')
    async patchTotalPrice(@Req() req: Request, @Body() body: UpdataPriceDTO) {
        const userId = req['user'].userId as number
        const { quantCurrent, idItem } = body

        return await this.cartService.patchQuant(userId, quantCurrent, idItem)
    }

    @SkipThrottle(...filterSkipThrottler('createPurchaseLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ createPurchaseLimit: { ttl: 60000, limit: 30 } })
    @Post('create-purchase')
    async postCreatePurchse(
        @Req() req: Request,
        @Body() body: PurchaseDataDTO
    ) {
        const userId = req['user'].userId as number

        try {
            return await this.cartService.createPurchse(
                userId,
                body.itemsInfo,
                body.addressId
            )
        } catch (err) {
            if (err instanceof NotFoundException) throw err
            if (err instanceof BadRequestException) throw err
            if (err instanceof ConflictException) throw err

            console.log('Erro inesperado ao criar compra', err)
            throw new InternalServerErrorException(
                'Erro inesperado ao criar compra'
            )
        }
    }

    @SkipThrottle(...filterSkipThrottler('purchasePaidLimit'))
    @UseGuards(CrsfGuard, JwtGuard, UserThrottlerGuard)
    @Throttle({ purchasePaidLimit: { ttl: 60000, limit: 100 } })
    @Get('purchase-paid')
    async getPurchasePaid(@Req() req: Request) {
        const userId = req['user'].userId as number

        try {
            return this.cartService.purchasePaid(userId)
        } catch (err) {
            console.log(err)
            throw new BadRequestException({
                message: 'Erro ao pegar items',
                error: 'Erro ao pegar items',
                statusCode: 400
            })
        }
    }
}
