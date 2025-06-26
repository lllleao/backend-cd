import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { CatsController } from './cats.controller'
import { AppService } from './app.service'
import { CatService } from './providers/cats.service'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './books/user.module'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
    imports: [
        PrismaModule,
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') })
    ],
    controllers: [AppController, CatsController],
    providers: [AppService, CatService]
})
export class AppModule {}
