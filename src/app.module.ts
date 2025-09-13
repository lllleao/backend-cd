import { ThrottlerModule } from '@nestjs/throttler'
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
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { UserThrottlerGuard } from './Throttler/user.throttler.guard'
import { ThrottlerExceptionFilter } from './Throttler/throttler-exception.filter'

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
        CartModule,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: 'default',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'login',
                    ttl: 60000,
                    limit: 4
                },
                {
                    name: 'csrfToken',
                    ttl: 60000,
                    limit: 50
                }
            ]
        })
    ],
    controllers: [AppController, CatsController],

    providers: [
        AppService,
        { provide: APP_GUARD, useClass: UserThrottlerGuard },
        { provide: APP_FILTER, useClass: ThrottlerExceptionFilter }
    ]
})
export class AppModule {}
