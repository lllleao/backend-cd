import * as jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET as string

type TokenProp = {
    email: string
    userId: number
}
const verifyJwtToken = (token: string): Promise<TokenProp> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err)
            }

            resolve(decoded as TokenProp)
        })
    })
}

export default verifyJwtToken
