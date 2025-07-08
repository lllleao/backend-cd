import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BooksService {
    constructor(private prisma: PrismaService) {}

    async findAllFreeBooks() {
        return await this.prisma.public_book.findMany()
    }

    async findAllStoreBooks() {
        return await this.prisma.store_book.findMany()
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
