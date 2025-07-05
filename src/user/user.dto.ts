import { Type } from 'class-transformer'
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
    ValidateNested
} from 'class-validator'
import { Trim } from 'src/common/utils/trim.utils'

export class SignupDTO {
    @Trim()
    @IsEmail({}, { message: 'Emial incorreto' })
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O e-mail deve ser uma string' })
    email: string

    @Trim()
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    name: string

    @Trim()
    @IsString({ message: 'A senha deve ser uma string' })
    @IsNotEmpty({ message: 'Obrigatório' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
        message:
            'A senha deve ter pelo menos 8 caracteres, com letras e números'
    })
    password: string
}

export class LoginDTO {
    @Trim()
    @IsEmail({}, { message: 'Emial incorreto' })
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O e-mail deve ser uma string' })
    email: string

    @Trim()
    @IsString({ message: 'A senha deve ser uma string' })
    @IsNotEmpty({ message: 'Obrigatório' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
        message:
            'A senha deve ter pelo menos 8 caracteres, com letras e números'
    })
    password: string
}

export class AddressDataDto {
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
    @Length(1, 40)
    street: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Length(1, 40)
    neighborhood: string

    @Trim()
    @IsOptional()
    @IsString()
    @Length(0, 40)
    @Trim()
    complement?: string

    @Trim()
    @IsString()
    @IsNotEmpty()
    @Length(1, 6)
    number: string

    @IsBoolean()
    isDefault: boolean

    @Trim()
    @IsNotEmpty({ message: 'Obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    name: string
}

export class CreateAddressDto {
    @ValidateNested()
    @Type(() => AddressDataDto)
    data: AddressDataDto
}
