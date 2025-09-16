import { Trim } from 'class-sanitizer'
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreateCobPix {
    @IsInt()
    @IsNumber()
    @IsNotEmpty()
    @Trim()
    @Min(1)
    purchaseId: number
}
