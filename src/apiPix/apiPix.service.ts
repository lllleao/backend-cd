import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import {
    ApiPixTokenOAuthType,
    CobUserInfos,
    QrCodePixType
} from './apiPix.types'
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
        tokenData: { access_token: string; expires_in: number },
        userInfos: CobUserInfos
    ) {
        const { agent } = getCredentialsApiPix()
        const url = `${process.env.URL_EFI_API_DEV}/v2/cob/`

        const data = {
            calendario: {
                expiracao: 1800
            },
            devedor: {
                cpf: String(userInfos.buyerCPF),
                nome: userInfos.buyerName
            },
            valor: {
                original: String(userInfos.totalPrice.toFixed(2))
            },
            chave: 'e6ab7dd0-5cd9-4370-939c-5f258bdad648',
            solicitacaoPagador: `${userInfos.purchaseId}`
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

    async generateQrCode(userInfos: CobUserInfos) {
        const { agent } = getCredentialsApiPix()

        let tokenData = await this.cacheManager.get<{
            access_token: string
            expires_in: number
        }>('oauthApiPix')
        if (!tokenData || Date.now() >= tokenData.expires_in) {
            tokenData = (await this.getOAuthTokenPix()).data
        }
        const idLoc = await this.criarCobApiPix(tokenData, userInfos)

        const url = `${process.env.URL_EFI_API_DEV}/v2/loc/${
            idLoc.data.loc.id
        }/qrcode/`

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

    async getPendingPurchase(userId: number) {
        const pendingPurchase = await this.prismaService.purchase.findFirst({
            where: {
                userId,
                status: 'PENDING'
            }
        })

        return {
            buyerName: pendingPurchase?.buyerName,
            buyerAddress: pendingPurchase?.buyerAddress,
            totalPrice: pendingPurchase?.totalPrice,
            qrCodeBase64: String(pendingPurchase?.qrCodeBase64),
            copyPastePix: String(pendingPurchase?.copyPastePix),
            status: pendingPurchase?.status
        }
    }

    async getIsPaid(userId: number) {
        const purchasePending = await this.prismaService.purchase.findFirst({
            where: {
                userId,
                status: 'PENDING'
            }
        })

        return {
            status: purchasePending?.status
        }
    }
}
