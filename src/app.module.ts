import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { CatsController } from './cats.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { BooksrModule } from './books/books.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './emial/email.module'
import { UserModel } from './user/user.module'
import { CartModule } from './cart/cart.module'

@Module({
    imports: [
        PrismaModule,
        BooksrModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AuthModule,
        EmailModule,
        UserModel,
        CartModule
    ],
    controllers: [AppController, CatsController],
    providers: [AppService]
})
export class AppModule {}
