/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform } from 'class-transformer'
import {
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsOptional
} from 'class-validator'
import { formatPhoneNumber } from './utils/formatPhone'

export class ContactDto {
    @IsEmail({}, { message: 'Email inválido' })
    emailUser: string

    @IsNotEmpty({ message: 'Nome obrigatório' })
    name: string

    @IsNotEmpty({ message: 'Mensagem é obrigatória' })
    text: string

    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    @Transform(({ value }) => formatPhoneNumber(value))
    @IsNumberString({}, { message: 'Número inválido' })
    number?: string
}
