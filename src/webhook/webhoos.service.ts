import { Injectable } from '@nestjs/common'
import { getUrlWithHMAC } from './utils'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { ApiPixService } from '../apiPix/apiPix.service'
import { getCredentialsApiPix } from '../apiPix/utils/credentialsApiPix'

@Injectable()
export class WebHookApiPixService {
    constructor(
        private readonly httpService: HttpService,
        private apiPixService: ApiPixService
    ) {}
    async configUlr() {
        const { agent } = getCredentialsApiPix()

        const tokenData = await this.apiPixService.getOAuthTokenPix()

        const url = process.env.URL_EFI_API_DEV as string
        const urlHost = getUrlWithHMAC()

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + tokenData.data.access_token,
                'x-skip-mtls-checking': true
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
}
