import { Transform } from 'class-transformer'
import {
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString
} from 'class-validator'
import { formatPhoneNumber } from './utils/formatPhone'

export class ContactDto {
    @IsEmail({}, { message: 'Email inválido' })
    @IsString({ message: 'A senha deve ser uma string' })
    emailUser: string

    @IsNotEmpty({ message: 'Nome obrigatório' })
    @IsString({ message: 'A senha deve ser uma string' })
    name: string

    @IsNotEmpty({ message: 'Mensagem é obrigatória' })
    @IsString({ message: 'A senha deve ser uma string' })
    text: string

    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    @Transform(({ value }) => formatPhoneNumber(value))
    @IsNumberString({}, { message: 'Número inválido' })
    number?: string
}
