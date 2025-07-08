import { Controller, Get, Query, Req } from '@nestjs/common'
import { Request } from 'express'

@Controller('cats')
export class CatsController {
    @Get()
    findAll(@Req() resquest: Request): string {
        console.log(resquest)
        return 'This action returns all cats'
    }

    @Get('getUser')
    findOne(@Query('rapaz') rapaz: string): string {
        console.log(rapaz)
        return `${rapaz}`
    }
}
