/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable } from '@nestjs/common'
import { formatDate, getUrlWithHMAC } from './utils'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { ApiPixService } from '../apiPix/apiPix.service'
import { getCredentialsApiPix } from '../apiPix/utils/credentialsApiPix'
import { PrismaService } from '../prisma/prisma.service'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { EmailService } from '../emial/email.service'

@Injectable()
export class WebHookApiPixService {
    constructor(
        private readonly httpService: HttpService,
        private apiPixService: ApiPixService,
        private prismaService: PrismaService,
        private emailService: EmailService,
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

        await firstValueFrom(
            this.httpService.put(
                `${url}/v2/webhook/e6ab7dd0-5cd9-4370-939c-5f258bdad648`,
                body,
                config
            )
        )
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
        const purchaseUpdated = await this.prismaService.purchase.update({
            where: {
                id: Number(purchaseId)
            },
            data: {
                status: 'PAID'
            }
        })

        const emailUser = await this.prismaService.user_cd.findUnique({
            where: {
                id: purchaseUpdated.userId
            }
        })

        const mailOptionsClient = {
            from: process.env.EMAIL_USER,
            to: emailUser?.email,
            replyTo: process.env.EMAIL_USER,
            subject: 'Compra realizada',
            html: `<h1>Sua compra no valor de R$ ${purchaseUpdated.totalPrice} foi realizada com sucesso, as informações sobre o status da entrega estão no nosso site.</h1></br>`
        }

        const mailOptionsCD = {
            from: process.env.EMAIL_USER,
            to: 'cidadeclipse@gmail.com',
            replyTo: process.env.EMAIL_USER,
            subject: 'Compra realizada',
            html: `<h1>Compra realizada</h1>
            <h3>Nome: ${purchaseUpdated.buyerName}</h3>
            <h3>Endereço: ${purchaseUpdated.buyerAddress}</h3>
            <h3>CPF: ${purchaseUpdated.buyerCPF}</h3>
            <h3>Data da compra: ${formatDate(purchaseUpdated?.createdAt)}</h3>
            <h3>Total: R$ ${purchaseUpdated.totalPrice}</h3>
            `
        }

        await this.emailService.sendEmail(mailOptionsClient)
        await this.emailService.sendEmail(mailOptionsCD)
    }
}
