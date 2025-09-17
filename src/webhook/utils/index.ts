import * as crypto from 'crypto'

export const getUrlWithHMAC = () => {
    const secret = process.env.URL_HMAC_EFI_API
    const baseUrl = process.env.MEU_DOMINIO as string

    const hmac = crypto
        .createHmac('sha256', secret as string)
        .update(baseUrl)
        .digest('hex')
    const webhookUrl = `${baseUrl}/webhook?hmac=${hmac}&ignorar=`
    return webhookUrl
}

export const formatDate = (dateIso: Date) => {
    const data = new Date(dateIso)
    const dateFormated = data.toLocaleString('pt-br', { timeZone: 'UTC' })
    return dateFormated.slice(0, 10)
}
