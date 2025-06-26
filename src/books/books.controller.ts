import { Controller, Get } from '@nestjs/common'
import { UserService } from './books.service'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUsers() {
        return this.userService.findAll()
    }
}
