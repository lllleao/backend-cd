export type ApiPixTokenOAuthType = {
    data: {
        access_token: string
        expires_in: number
    }
}

export type QrCodePixType = {
    data: {
        qrcode: string
        imagemQrcode: string
    }
}
