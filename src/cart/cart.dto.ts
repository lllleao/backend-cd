import {
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
    Matches
} from 'class-validator'
import { Trim } from 'src/common/utils/trim.utils'

export class ItemCartDTP {
    @IsString({ message: 'A senha deve ser uma string' })
    @IsNotEmpty({ message: 'Campo obrigatório' })
    photo: string

    @IsNumberString({}, { message: 'Número inválido' })
    @IsNotEmpty({ message: 'Campo obrigatório' })
    price: number

    @IsNumberString({}, { message: 'Número inválido' })
    @IsNotEmpty({ message: 'Campo obrigatório' })
    quant: number

    @IsString({ message: 'A senha deve ser uma string' })
    @IsNotEmpty({ message: 'Campo obrigatório' })
    name: string
}

export class UpdataPriceDTO {
    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    quantBefore: number

    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    quantCurrent: number

    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    idItem: number

    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    price: number
}

type ItemsInfo = {
    price: number
    quant: number
    id?: number
    name: string
    photo: string
}

export class PurchaseDataDTO {
    @Trim()
    @IsString()
    @IsNotEmpty()
    name: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{11}$/, {
        message: 'CPF deve conter exatamente 11 dígitos numéricos'
    })
    cpf: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{8}$/, {
        message: 'CEP deve conter exatamente 8 dígitos numéricos'
    })
    zipCode: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    street: string

    @Trim()
    @IsOptional()
    @IsString()
    @Length(0, 40)
    @Trim()
    complement?: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Length(1, 40)
    neighborhood: string

    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    totalPrice: number

    itemsInfo: ItemsInfo[]
}
