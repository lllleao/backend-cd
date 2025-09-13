import { Transform, Type } from 'class-transformer'
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
    Min,
    IsInt,
    IsBoolean
} from 'class-validator'
import { Trim } from '../common/utils/trim.utils'
import { Escape } from 'class-sanitizer'
import { isValidCPF } from 'src/user/utils/isValidCPF'

export class ItemCartDTP {
    @IsString({ message: 'A senha deve ser uma string' })
    @IsNotEmpty({ message: 'Campo obrigatório' })
    photo: string

    @Type(() => Number)
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1)
    price: number

    @Type(() => Number)
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Min(1)
    @IsInt()
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

class ItemsInfo {
    @IsNotEmpty()
    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    price: number

    @IsNotEmpty()
    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    quant: number

    @IsNotEmpty()
    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    id: number

    @Trim()
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    @Escape()
    @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
        message: 'O nome deve conter apenas letras'
    })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    @Transform(({ value }: { value: string }) =>
        value
            .trim()
            .toLowerCase()
            .replace(/(^\p{L}|\s\p{L})/gu, (char: string) => char.toUpperCase())
    )
    name: string

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    photo: string
}

export class PurchaseDataDTO {
    @Trim()
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    @Escape()
    @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
        message: 'O nome deve conter apenas letras'
    })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    @Transform(({ value }: { value: string }) =>
        value
            .trim()
            .toLowerCase()
            .replace(/(^\p{L}|\s\p{L})/gu, (char: string) => char.toUpperCase())
    )
    name: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Escape()
    @Matches(/^\d{11}$/, {
        message: 'CPF deve conter exatamente 11 dígitos numéricos'
    })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    @isValidCPF({ message: 'CPF inválido' })
    cpf: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Length(1, 6)
    @Escape()
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    number: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Escape()
    @Matches(/^\d{8}$/, {
        message: 'CEP deve conter exatamente 8 dígitos numéricos'
    })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    zipCode: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Length(1, 40)
    @Escape()
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    @Transform(({ value }: { value: string }) =>
        value
            .trim()
            .toLowerCase()
            .replace(/(^\p{L}|\s\p{L})/gu, (char: string) => char.toUpperCase())
    )
    street: string

    @IsOptional()
    @Trim()
    @IsString()
    @Length(0, 40)
    @Trim()
    @Escape()
    complement?: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Length(1, 40)
    @Escape()
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    @Transform(({ value }: { value: string }) =>
        value
            .trim()
            .toLowerCase()
            .replace(/(^\p{L}|\s\p{L})/gu, (char: string) => char.toUpperCase())
    )
    neighborhood: string

    @IsNumber()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    totalPrice: number

    @IsBoolean()
    @Escape()
    @IsNotEmpty()
    isDefault: boolean

    @IsNotEmpty()
    itemsInfo: ItemsInfo[]
}
