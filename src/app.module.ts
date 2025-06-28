import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { CatsController } from './cats.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { BooksrModule } from './books/books.module'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './emial/email.module'

@Module({
    imports: [
        PrismaModule,
        BooksrModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
        }),
        AuthModule,
        EmailModule
    ],
    controllers: [AppController, CatsController],
    providers: [AppService]
})
export class AppModule {}
