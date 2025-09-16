import * as fs from 'fs'
import * as https from 'https'

export const getCredentialsApiPix = () => {
    const certificado = fs.readFileSync(
        process.env.CERTIFICADO_PRIVADO as string
    )

    if (!certificado)
        throw new Error('CERTIFICADO environment variable is not set')

    const grantType = { grant_type: 'client_credentials' }

    const credenciais = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }
    const data_credentials =
        credenciais.client_id + ':' + credenciais.client_secret

    const auth = Buffer.from(data_credentials).toString('base64')

    const agent = new https.Agent({
        pfx: certificado,
        passphrase: ''
    })

    return { grantType, auth, agent }
}
