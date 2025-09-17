import { Module } from '@nestjs/common'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { ApiPixService } from '../apiPix/apiPix.service'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [HttpModule],
    controllers: [CartController],
    providers: [CartService, ApiPixService]
})
export class CartModule {}
