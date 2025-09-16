import { Injectable } from '@nestjs/common'
import { getUrlWithHMAC } from './utils'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { ApiPixService } from '../apiPix/apiPix.service'
import * as fs from 'fs'
import * as https from 'https'

@Injectable()
export class WebHookApiPixService {
    constructor(
        private readonly httpService: HttpService,
        private apiPixService: ApiPixService
    ) {}
    async configUlr() {
        const agent = new https.Agent({
            cert: fs.readFileSync(process.env.CERTIFICADO_SSL as string),
            key: fs.readFileSync(process.env.PRIVATE_KEY as string),
            ca: fs.readFileSync(process.env.CERTIFICADO_PUBLICO as string),
            rejectUnauthorized: true
        })
        const tokenData = await this.apiPixService.getOAuthTokenPix()

        const url = process.env.URL_EFI_API_DEV as string
        const urlHost = getUrlWithHMAC()

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + tokenData.data.access_token,
                'Content-Type': 'application/json',
                'x-skip-mtls-checking': 'false'
            },
            httpsAgent: agent,
            params: {
                chave: 'e6ab7dd0-5cd9-4370-939c-5f258bdad648'
            }
        }

        const body = {
            webhookUrl: urlHost
        }

        const response = await firstValueFrom(
            this.httpService.patch(`${url}/v2/webhook/${urlHost}`, body, config)
        )

        console.log(response)
    }
}
