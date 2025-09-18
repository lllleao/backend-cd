import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Query,
    UseGuards
} from '@nestjs/common'
import { BooksService } from './books.service'
import { Books, BookSpecific } from '../common/types'
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { filterSkipThrottler } from '../utils'
import { UserThrottlerGuard } from '../Throttler/user.throttler.guard'

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @SkipThrottle(...filterSkipThrottler('publicBooks'))
    @UseGuards(UserThrottlerGuard)
    @Throttle({ publicBooks: { ttl: 60000, limit: 200 } })
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

    @SkipThrottle(...filterSkipThrottler('publicBooks'))
    @UseGuards(UserThrottlerGuard)
    @Throttle({ publicBooks: { ttl: 60000, limit: 200 } })
    @Get('free-length')
    async getAllFreeBooks(): Promise<Books[]> {
        return (await this.booksService.findAllFreeBooksLength()) as unknown as Books[]
    }

    @SkipThrottle(...filterSkipThrottler('storeBooks'))
    @UseGuards(UserThrottlerGuard)
    @Throttle({ storeBooks: { ttl: 60000, limit: 200 } })
    @Get('store')
    async getAllStoreBooks() {
        return await this.booksService.findAllStoreBooks()
    }

    @SkipThrottle(...filterSkipThrottler('storeBooks'))
    @UseGuards(UserThrottlerGuard)
    @Throttle({ storeBooks: { ttl: 60000, limit: 200 } })
    @Get('store/:id')
    async getSpecificStoreBook(
        @Param('id', ParseIntPipe) id: number
    ): Promise<BookSpecific> {
        return (await this.booksService.findSpecificStoreBook(
            id
        )) as unknown as BookSpecific
    }
}
