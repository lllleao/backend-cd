import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ItemsInfoDTO } from './cart.dto'
import cpfValidator from '../user/utils/cpfValidator'

@Injectable()
export class CartService {
    constructor(private prismaService: PrismaService) {}
    async addToCart(
        userId: number,
        name: string,
        photo: string,
        price: number,
        quant: number,
        productId: number
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
                quant,
                productId
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

    async delete(id: number) {
        const item = await this.prismaService.item.delete({
            where: {
                id: id
            }
        })

        return item
    }

    async patchQuant(userId: number, newQuant: number, idItem: number) {
        const user = await this.prismaService.user_cd.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new BadRequestException('Usuário não existe.')
        }

        await this.prismaService.item.update({
            where: {
                id: idItem
            },
            data: {
                quant: newQuant
            }
        })

        return { priceupdated: true }
    }

    async createPurchse(
        userId: number,
        items: ItemsInfoDTO[],
        addressId: number
    ) {
        const productsId = items.map((item) => item.productId)
        const products = await this.prismaService.store_book.findMany({
            where: {
                id: { in: productsId }
            }
        })

        if (products.length !== items.length) {
            throw new BadRequestException(
                'Um ou mais produtos não existem ou estão inativos'
            )
        }

        const totalPrice = items.reduce((acum, currentItem) => {
            return acum + currentItem.price * currentItem.quant
        }, 0)

        if (totalPrice <= 1) {
            throw new BadRequestException('Valor total inválido')
        }

        const addressPurchase = await this.prismaService.address.findUnique({
            where: {
                id: addressId
            }
        })

        if (!cpfValidator(addressPurchase?.cpf as string)) {
            throw new BadRequestException('CPF inválido')
        }
        const response = await this.prismaService.$transaction(async (tx) => {
            const newPurchase = await tx.purchase.create({
                data: {
                    buyerAddress: `${addressPurchase?.zipCode}-${addressPurchase?.neighborhood}-${addressPurchase?.street}-${addressPurchase?.number}`,
                    buyerAddressId: addressId,
                    buyerCPF: addressPurchase?.cpf as string,
                    buyerName: addressPurchase?.name as string,
                    totalPrice,
                    userId
                }
            })

            await tx.purchaseItem.createMany({
                data: items.map(({ name, photo, price, quant }) => {
                    return {
                        name,
                        quant,
                        price,
                        photo,
                        purchaseId: newPurchase.id
                    }
                })
            })

            return newPurchase
        })

        return { message: 'Compra criada com sucesso', purchaseId: response.id }
    }
}
