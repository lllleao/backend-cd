import * as csrf from 'csrf'

const tokenCsrf = new csrf()

export function generateCsrfToken() {
    const secret = process.env.CSRF_SECRET as string
    const token = tokenCsrf.create(secret)
    return { token, secret }
}

export function verifyCsrfToken(tokenIn: string): boolean {
    return tokenCsrf.verify(process.env.CSRF_SECRET as string, tokenIn)
}
