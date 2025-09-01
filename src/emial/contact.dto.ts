import { Transform } from 'class-transformer'
import {
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
    Matches
} from 'class-validator'
import { Trim } from '../common/utils/trim.utils'

export class ContactDto {
    @Trim()
    @IsEmail({}, { message: 'Emial incorreto' })
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O e-mail deve ser uma string' })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
    emailUser: string

    @Trim()
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
        message: 'O nome deve conter apenas letras'
    })
    @Matches(/^(?!\s*$).+/, { message: 'O nome não pode ser só espaços' })
    @Transform(({ value }: { value: string }) =>
        value
            .trim()
            .toLowerCase()
            .replace(/(^\p{L}|\s\p{L})/gu, (char: string) => char.toUpperCase())
    )
    name: string

    @IsNotEmpty({ message: 'Mensagem é obrigatória' })
    @Trim()
    @IsString({ message: 'A senha deve ser uma string' })
    @Length(19, 100)
    @Matches(/^[\p{L}\p{M}0-9!@?,.\s]+$/u, {
        message: 'A mensagem contém caracteres inválidos'
    })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    text: string

    @IsOptional()
    @Trim()
    @IsNumberString({}, { message: 'Número inválido' })
    @Matches(/^(?!\s*$).+/, { message: 'O campo não pode ser só espaços' })
    phone?: string
}
