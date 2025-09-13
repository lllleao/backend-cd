import { Controller, Get } from '@nestjs/common'
import { Request } from 'express'

@Controller('cats')
export class CatsController {
    @Get()
    findAll(): string {
        return 'This action returns all cats'
    }
}
