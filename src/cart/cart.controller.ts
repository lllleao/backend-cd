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
import { Throttle } from '@nestjs/throttler'

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Post('add')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ login: { ttl: 60000, limit: 30 } })
    async addToCart(@Req() req: Request, @Body() body: ItemCartDTP) {
        const userId = req['user'].userId as number
        try {
            return await this.cartService.addToCart(
                userId,
                body.name,
                body.photo,
                body.price,
                body.quant,
                body.id
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
        return await this.cartService.delete(id)
    }

    @Patch('update-price')
    @UseGuards(CrsfGuard, JwtGuard)
    @Throttle({ login: { ttl: 60000, limit: 100 } })
    async patchTotalPrice(@Req() req: Request, @Body() body: UpdataPriceDTO) {
        const userId = req['user'].userId as number
        const { quantCurrent, idItem } = body

        return await this.cartService.patchQuant(userId, quantCurrent, idItem)
    }

    @Post('create-purchase')
    @UseGuards(CrsfGuard, JwtGuard)
    // @Throttle({ login: { ttl: 60000, limit: 3 } })
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
}
