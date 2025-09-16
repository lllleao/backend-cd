// app.module.ts ou purchase.module.ts
import { Module } from '@nestjs/common'
import { ApiPixService } from './apiPix.service'
import { HttpModule } from '@nestjs/axios'
import { ApiPixController } from './apiPix.controller'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
    imports: [
        HttpModule,
        CacheModule.register({
            isGlobal: true,
            ttl: 0
        })
    ],
    providers: [ApiPixService],
    controllers: [ApiPixController]
})
export class ApiPixModule {}
