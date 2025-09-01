import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BooksService {
    constructor(private prisma: PrismaService) {}

    async findAllFreeBooks() {
        return await this.prisma.public_book.findMany()
    }

    async findAllStoreBooks() {
        const booksStore = await this.prisma.store_book.findMany()

        return booksStore.map((item) => {
            return {
                title: item.title,
                descBooks: item.descBook,
                photo: item.photo,
                id: item.id,
                price: item.price
            }
        })
    }

    async findSpecificStoreBook(id: number) {
        const specific = await this.prisma.store_book.findUnique({
            where: {
                id
            },
            include: {
                store_books_credits: true
            }
        })
        return specific
    }
}
