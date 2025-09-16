import * as crypto from 'crypto'

export const getUrlWithHMAC = () => {
    const secret = process.env.URL_HMAC_EFI_API
    const baseUrl = 'https://cidadeclipsebackend.com.br' as string

    const hmac = crypto
        .createHmac('sha256', secret as string)
        .update(baseUrl)
        .digest('hex')
    const webhookUrl = `${baseUrl}/webhook?hmac=${hmac}&ignorar=`
    return webhookUrl
}
