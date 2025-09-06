import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { BooksService } from './books.service'
import { Books, BookSpecific } from '../common/types'

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @Get('free')
    async getAllFreeBooks(): Promise<Books[]> {
        console.log('ola')
        return (await this.booksService.findAllFreeBooks()) as unknown as Books[]
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
