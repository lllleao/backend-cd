import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CartService {
    constructor(private prismaService: PrismaService) {}
    async addToCart(
        userId: number,
        name: string,
        photo: string,
        price: number,
        quant: number
    ) {
        const cart = await this.prismaService.cart.findUnique({
            where: {
                userId
            }
        })

        if (!cart) {
            throw new BadRequestException({
                message: 'Carrinho não encontrado',
                error: 'Carrinho não encontrado',
                statusCode: 400
            })
        }

        await this.prismaService.item.create({
            data: {
                cartId: cart?.id,
                userId,
                name,
                photo,
                price,
                quant
            }
        })

        const calcTotalPrice = await this.prismaService.item.aggregate({
            _sum: {
                price: true
            },
            where: {
                userId
            }
        })

        await this.prismaService.cart.update({
            where: {
                userId
            },
            data: {
                totalPrice: calcTotalPrice._sum.price || 0
            }
        })

        return { success: true }
    }

    async itemsCart(userId: number) {
        const items = await this.prismaService.item.findMany({
            where: {
                userId
            }
        })
        return items
    }

    async delete(id: number, userId: number) {
        const item = await this.prismaService.item.delete({
            where: {
                id: id
            }
        })

        const cart = await this.prismaService.cart.findUnique({
            where: {
                userId
            }
        })

        await this.prismaService.cart.update({
            where: {
                userId
            },
            data: {
                totalPrice: Number(cart?.totalPrice) - item.price
            }
        })
        return item
    }

    async totalPrice(userId: number) {
        const cart = await this.prismaService.cart.findUnique({
            where: {
                userId
            }
        })

        return { totalPrice: cart?.totalPrice }
    }

    async patchTotalPrice(
        userId: number,
        quantCurrent: number,
        quantBefore: number,
        idItem: number,
        price: number
    ) {
        await this.prismaService.item.update({
            where: {
                id: idItem
            },
            data: {
                quant: quantCurrent,
                price: (price / quantBefore) * quantCurrent
            }
        })

        const calcTotalPrice = await this.prismaService.item.aggregate({
            _sum: {
                price: true
            },
            where: {
                userId
            }
        })

        await this.prismaService.cart.update({
            where: {
                userId
            },
            data: {
                totalPrice: calcTotalPrice._sum.price || 0
            }
        })

        return { priceupdated: true }
    }
}
