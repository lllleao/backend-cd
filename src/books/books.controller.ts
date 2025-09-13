/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { BooksService } from './books.service'
import { Books, BookSpecific } from '../common/types'
import { Throttle } from '@nestjs/throttler'

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @Get('free')
    @Throttle({ default: { ttl: 60000, limit: 200 } })
    async getFreeBooksPage(
        @Query('take', ParseIntPipe) take: number,
        @Query('skip', ParseIntPipe) skip: number
    ): Promise<Books[]> {
        return (await this.booksService.findFreeBooks(
            take,
            skip
        )) as unknown as Books[]
    }

    @Get('free-length')
    @Throttle({ default: { ttl: 60000, limit: 200 } })
    async getAllFreeBooks(): Promise<Books[]> {
        return (await this.booksService.findAllFreeBooksLength()) as unknown as Books[]
    }

    @Get('store')
    @Throttle({ csrfToken: { ttl: 60000, limit: 100 } })
    async getAllStoreBooks() {
        return await this.booksService.findAllStoreBooks()
    }

    @Get('store/:id')
    @Throttle({ csrfToken: { ttl: 60000, limit: 100 } })
    async getSpecificStoreBook(
        @Param('id', ParseIntPipe) id: number
    ): Promise<BookSpecific> {
        return (await this.booksService.findSpecificStoreBook(
            id
        )) as unknown as BookSpecific
    }
}
