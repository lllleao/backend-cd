import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { BooksService } from './books.service'
import { Books, BookSpecific } from '../common/types'

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @Get('free')
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
    async getAllFreeBooks(): Promise<Books[]> {
        return (await this.booksService.findAllFreeBooksLength()) as unknown as Books[]
    }

    @Get('store')
    async getAllStoreBooks() {
        return await this.booksService.findAllStoreBooks()
    }

    @Get('store/:id')
    async getSpecificStoreBook(
        @Param('id', ParseIntPipe) id: number
    ): Promise<BookSpecific> {
        return (await this.booksService.findSpecificStoreBook(
            id
        )) as unknown as BookSpecific
    }
}
