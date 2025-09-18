import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ItemsInfoDTO } from './cart.dto'
import cpfValidator from '../user/utils/cpfValidator'
import { ApiPixService } from '../apiPix/apiPix.service'
import { calcFrete } from './utils'

@Injectable()
export class CartService {
    constructor(
        private prismaService: PrismaService,
        private apiPixService: ApiPixService
    ) {}
    async addToCart(
        userId: number,
        name: string,
        photo: string,
        price: number,
        quant: number,
        productId: number,
        stock: number
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
                productId,
                stock
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

    async getPendingPurchase(userId: number) {
        const pendingPurchase = await this.prismaService.purchase.findFirst({
            where: {
                userId,
                status: 'PENDING'
            }
        })

        return { pendingPurchase }
    }

    async createPurchse(
        userId: number,
        items: ItemsInfoDTO[],
        addressId: number
    ) {
        const { pendingPurchase } = await this.getPendingPurchase(userId)

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

        if (totalPrice <= 9) {
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

        const addressUser = `${addressPurchase?.zipCode}-${addressPurchase?.neighborhood}-${addressPurchase?.street}-${addressPurchase?.number}`

        if (pendingPurchase) {
            await this.prismaService.purchase.delete({
                where: {
                    id: pendingPurchase.id
                }
            })
        }

        const purchase = await this.prismaService.$transaction(async (tx) => {
            const newPurchase = await tx.purchase.create({
                data: {
                    buyerAddress: addressUser,
                    buyerAddressId: addressId,
                    buyerCPF: addressPurchase?.cpf as string,
                    buyerName: addressPurchase?.name as string,
                    totalPrice: calcFrete(totalPrice),
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

        const infoPix = await this.apiPixService.generateQrCode({
            buyerCPF: purchase.buyerCPF,
            buyerName: purchase.buyerName,
            totalPrice: purchase.totalPrice,
            purchaseId: purchase.id
        })

        const expirationTime = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos

        await this.prismaService.purchase.update({
            where: {
                id: purchase.id
            },
            data: {
                pixExpiration: expirationTime,
                qrCodeBase64: infoPix.data.imagemQrcode,
                copyPastePix: infoPix.data.qrcode
            }
        })

        return { message: 'Compra realizada com sucesso' }
    }

    async deleteAllItems(userId: number) {
        await this.prismaService.item.deleteMany({
            where: {
                userId
            }
        })
    }
    async purchasePaid(userId: number) {
        return await this.prismaService.purchase.findMany({
            where: {
                userId,
                status: 'PAID'
            },
            include: {
                items: true
            }
        })
    }
}
