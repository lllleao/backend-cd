import { Body, Controller, Post } from '@nestjs/common'
import { ApiPixService } from './apiPix.service'
import { CreateCobPix } from './apiPix.dto'

@Controller('api-pix')
export class ApiPixController {
    constructor(private apiPixService: ApiPixService) {}
    @Post('pay-pix')
    async payWithPix(@Body() body: CreateCobPix) {
        try {
            const response = await this.apiPixService.generateQrCode(
                body.purchaseId
            )

            console.log(response)
        } catch (err) {
            console.log(err)
        }
    }
}
