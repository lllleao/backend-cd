import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { ApiPixTokenOAuthType, QrCodePixType } from './apiPix.types'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PrismaService } from '../prisma/prisma.service'
import { getCredentialsApiPix } from './utils/credentialsApiPix'
import { AxiosRequestConfig } from 'axios'

@Injectable()
export class ApiPixService {
    constructor(
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private prismaService: PrismaService
    ) {}

    async getOAuthTokenPix(): Promise<ApiPixTokenOAuthType> {
        const { agent, auth, grantType } = getCredentialsApiPix()

        const config: [string, unknown, AxiosRequestConfig] = [
            `${process.env.URL_EFI_API_DEV}/oauth/token`,
            grantType,
            {
                headers: {
                    Authorization: 'Basic ' + auth,
                    'Content-Type': 'application/json'
                },
                httpsAgent: agent
            }
        ]

        const response = (await firstValueFrom(
            this.httpService.post(...config)
        )) as unknown as ApiPixTokenOAuthType

        await this.cacheManager.set('oauthApiPix', {
            access_token: response.data.access_token,
            expires_in: Date.now() + response.data.expires_in * 1000
        })
        return response
    }

    async criarCobApiPix(
        purchaseId: number,
        tokenData: { access_token: string; expires_in: number }
    ) {
        const { agent } = getCredentialsApiPix()
        const url = `${process.env.URL_EFI_API_DEV}/v2/cob/`

        const purchaseData = await this.prismaService.purchase.findUnique({
            where: {
                id: purchaseId
            }
        })

        const data = {
            calendario: {
                expiracao: 1800
            },
            devedor: {
                cpf: String(purchaseData?.buyerCPF),
                nome: purchaseData?.buyerName
            },
            valor: {
                original: String(purchaseData?.totalPrice.toFixed(2))
            },
            chave: 'e6ab7dd0-5cd9-4370-939c-5f258bdad648',
            solicitacaoPagador: 'Cobrança de produtos.'
        }

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + tokenData.access_token,
                'Content-Type': 'application/json'
            },
            httpsAgent: agent
        }

        const response = (await firstValueFrom(
            this.httpService.post(url, data, config)
        )) as { data: { loc: { id: number } } }
        return response
    }

    async generateQrCode(purchaseId: number) {
        const { agent } = getCredentialsApiPix()

        let tokenData = await this.cacheManager.get<{
            access_token: string
            expires_in: number
        }>('oauthApiPix')

        if (!tokenData || Date.now() >= tokenData.expires_in) {
            tokenData = (await this.getOAuthTokenPix()).data
        }

        const idLoc = (await this.criarCobApiPix(purchaseId, tokenData)).data
            .loc.id

        const url = `${process.env.URL_EFI_API_DEV}/v2/loc/${idLoc}/qrcode/`

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + tokenData.access_token,
                'Content-Type': 'application/json'
            },
            httpsAgent: agent
        }

        const response = (await firstValueFrom(
            this.httpService.get(url, config)
        )) as QrCodePixType

        return response
    }

    webHookApiPix() {}
}
