import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common'
import { CreateAddressDto, LoginDTO, SignupDTO } from './user.dto'
import { UserService } from './user.service'
import { CrsfGuard } from 'src/auth/auth.crsf.guard'
import { Request, Response } from 'express'
import { JwtGuard } from 'src/auth/auth.jwt.guard'
import cpfValidator from './utils/cpfValidator'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(CrsfGuard)
    @Post('signup')
    async signup(@Req() req: Request, @Body() body: SignupDTO) {
        const { email, name, password } = body
        const token = req.cookies.token as string

        if (token) {
            throw new BadRequestException('Usuário já logado')
        }

        return await this.userService.createUser(password, email, name)
    }

    @UseGuards(CrsfGuard)
    @Post('login')
    async login(
        @Body() body: LoginDTO,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { email, password } = body
        const tokenFront = req.cookies
        console.log(tokenFront, 'aqui')
        if (tokenFront) {
            throw new BadRequestException('Usuário já logado')
        }

        const { token, refreshToken } = await this.userService.login(
            email,
            password
        )

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax', // none
            // secure: true, TROCAR PARA ALKGO SEGURO DEPOIS
            maxAge: 3600000
        })

        res.cookie('refresh', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax', // none
            // secure: true, TROCAR PARA ALKGO SEGURO DEPOIS
            maxAge: 604800000
        })

        return res.status(200).json({ success: true })
    }

    @UseGuards(CrsfGuard, JwtGuard)
    @Get('profile')
    async getProfileData(@Req() req: Request) {
        return await this.userService.profileData(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            req['user'].userId as number
        )
    }

    @UseGuards(CrsfGuard)
    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('token')

        res.status(200).json({ msg: 'Logout realizado' })
    }

    @UseGuards(CrsfGuard, JwtGuard)
    @Post('address')
    async postCreateAddress(
        @Req() req: Request,
        @Body() body: CreateAddressDto
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId = req['user'].userId as number
        const {
            cpf,
            isDefault,
            neighborhood,
            number,
            street,
            zipCode,
            complement,
            name
        } = body.data

        if (!cpfValidator(cpf)) {
            throw new BadRequestException('CPF inválido')
        }

        await this.userService.createAddress(
            { userId },
            {
                data: {
                    cpf,
                    isDefault,
                    neighborhood,
                    number,
                    street,
                    zipCode,
                    complement,
                    name
                }
            }
        )

        return { success: true }
    }

    @UseGuards(CrsfGuard, JwtGuard)
    @Get('get-address')
    async getAddress(@Req() req: Request) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId = req['user'].userId as number
        return await this.userService.addressUser(userId)
    }
}
