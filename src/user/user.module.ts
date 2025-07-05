import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { EmailService } from 'src/emial/email.service'

@Module({
    controllers: [UserController],
    providers: [UserService, EmailService]
})
export class UserModel {}
