import { Injectable } from '@nestjs/common'
import { Books, BookSpecific } from 'src/common/types'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BooksService {
    constructor(private prisma: PrismaService) {}

    async findAllFreeBooks(): Promise<Books[]> {
        try {
            const freebooks = await this.prisma.public_book.findMany()
            return freebooks as unknown as Books[]
        } catch (err) {
            console.error(err)
            throw Error('Erro ao buscar livros no BD')
        }
    }

    async findAllStoreBooks(): Promise<Books[]> {
        try {
            const storeBook = await this.prisma.store_book.findMany()
            return storeBook as unknown as Books[]
        } catch (err) {
            console.error(err)
            throw Error('Erro ao buscar livros no BD')
        }
    }

    async findSpecificStoreBook(id: number): Promise<BookSpecific> {
        try {
            const specific = await this.prisma.store_book.findUnique({
                where: {
                    id
                },
                include: {
                    store_books_credits: true
                }
            })
            return specific as unknown as BookSpecific
        } catch (err) {
            console.error(err)
            throw Error('Erro ao buscar livros no BD')
        }
    }
}
