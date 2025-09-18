import { Type } from 'class-transformer'
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Matches,
    Min,
    IsInt,
    Max,
    ArrayNotEmpty,
    IsArray,
    ValidateNested
} from 'class-validator'
import { Trim } from '../common/utils/trim.utils'

export class ItemCartDTP {
    @IsString({ message: 'O campo deve ser uma string' })
    @IsNotEmpty({ message: 'Campo obrigatório' })
    photo: string

    @Type(() => Number)
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(10)
    price: number

    @Type(() => Number)
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1)
    @Max(16)
    @IsInt()
    quant: number

    @IsString({ message: 'O campo deve ser uma string' })
    @IsNotEmpty({ message: 'Campo obrigatório' })
    name: string

    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1, { message: 'ID do produto inválido' })
    id: number

    @Type(() => Number)
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1)
    @Max(16)
    @IsInt()
    stock: number
}

export class UpdataPriceDTO {
    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @IsInt()
    @Min(1)
    @Max(16)
    quantCurrent: number

    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1)
    @IsInt()
    idItem: number
}

export class ItemsInfoDTO {
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @IsNumber()
    @Min(10)
    price: number

    @IsNotEmpty({ message: 'Campo obrigatório' })
    @IsNumber()
    @Min(1)
    @Max(16)
    quant: number

    @IsNumber()
    @IsInt()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1, { message: 'ID do produto inválido' })
    id: number

    @IsNumber()
    @IsInt()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1, { message: 'ID do produto inválido' })
    productId: number

    @Trim()
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    name: string

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    photo: string
}

export class PurchaseDataDTO {
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    addressId: number

    @IsArray()
    @ArrayNotEmpty({ message: 'É necessário enviar pelo menos 1 item' })
    @ValidateNested({ each: true })
    @Type(() => ItemsInfoDTO)
    itemsInfo: ItemsInfoDTO[]
}
