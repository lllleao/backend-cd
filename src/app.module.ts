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
import { APP_FILTER } from '@nestjs/core'
import { ThrottlerExceptionFilter } from './Throttler/throttler-exception.filter'
import { ApiPixModule } from './apiPix/apiPix.module'
import { WebHookApiPixModule } from './webhook/webhook.module'

@Module({
    imports: [
        PrismaModule,
        BooksrModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AuthModule,
        WebHookApiPixModule,
        EmailModule,
        UserModel,
        CartModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: 'publicBooks',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'storeBooks',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'payPixLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'isPaidLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'getCsrfTokenLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'verifyCsrfTokenLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'refreshLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'addLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'itemsLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'deleteLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'deleteAllLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'updatePriceLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'createPurchaseLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'purchasePaidLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'sendLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'confirmLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'signupLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'loginLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'profileLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'logoutLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'createAddressLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'getAddressLimit',
                    ttl: 60000,
                    limit: 200
                },
                {
                    name: 'getCookieLimit',
                    ttl: 60000,
                    limit: 200
                }
            ]
        }),
        ApiPixModule
    ],
    controllers: [AppController, CatsController],

    providers: [
        AppService,
        { provide: APP_FILTER, useClass: ThrottlerExceptionFilter }
    ]
})
export class AppModule {}
