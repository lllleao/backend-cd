import { Module } from '@nestjs/common'
import { UserService } from './books.service'
import { UserController } from './books.controller'

@Module({
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}
