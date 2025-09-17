/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable } from '@nestjs/common'
import { getUrlWithHMAC } from './utils'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { ApiPixService } from '../apiPix/apiPix.service'
import { getCredentialsApiPix } from '../apiPix/utils/credentialsApiPix'
import { PrismaService } from '../prisma/prisma.service'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

@Injectable()
export class WebHookApiPixService {
    constructor(
        private readonly httpService: HttpService,
        private apiPixService: ApiPixService,
        private prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
    async configUlr() {
        const { agent } = getCredentialsApiPix()

        const tokenData = await this.apiPixService.getOAuthTokenPix()

        const url = process.env.URL_EFI_API_DEV as string
        const urlHost = getUrlWithHMAC()

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + tokenData.data.access_token
            },
            httpsAgent: agent
        }

        const body = {
            webhookUrl: urlHost
        }

        const response = await firstValueFrom(
            this.httpService.put(
                `${url}/v2/webhook/e6ab7dd0-5cd9-4370-939c-5f258bdad648`,
                body,
                config
            )
        )
        console.log(response)
    }

    async checkPayment(txid: string) {
        const { agent } = getCredentialsApiPix()

        const url = process.env.URL_EFI_API_DEV as string

        let tokenData = await this.cacheManager.get<{
            access_token: string
            expires_in: number
        }>('oauthApiPix')

        if (!tokenData || Date.now() >= tokenData.expires_in) {
            tokenData = (await this.apiPixService.getOAuthTokenPix()).data
        }

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + tokenData.access_token
            },
            httpsAgent: agent
        }

        const response = await firstValueFrom(
            this.httpService.get(`${url}/v2/cob/${txid}`, config)
        )

        const purchaseId = response.data.solicitacaoPagador as string
        const cob = response.data.solicitacaoPagador as string
        console.log('AQUI É A COB', cob)
        return await this.prismaService.purchase.update({
            where: {
                id: Number(purchaseId)
            },
            data: {
                status: 'PAID'
            }
        })
    }
}
