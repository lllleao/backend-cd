import {
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    ParseIntPipe
} from '@nestjs/common'
import { BooksService } from './books.service'
import { Books, BookSpecific } from 'src/common/types'

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @Get('free')
    async getAllFreeBooks(): Promise<Books[]> {
        try {
            const data = await this.booksService.findAllFreeBooks()
            return data
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException(
                'Erro ao buscar os livros da loja'
            )
        }
    }

    @Get('store')
    async getAllStoreBooks(): Promise<Books[]> {
        try {
            const data = await this.booksService.findAllStoreBooks()
            return data
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException(
                'Erro ao buscar os livros da loja'
            )
        }
    }

    @Get('store/:id')
    async getSpecificStoreBook(
        @Param('id', ParseIntPipe) id: number
    ): Promise<BookSpecific> {
        try {
            const data = await this.booksService.findSpecificStoreBook(id)
            return data
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException(
                'Erro ao buscar os livros da loja'
            )
        }
    }
}
