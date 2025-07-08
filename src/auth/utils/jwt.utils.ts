import * as jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const generateJWTToken = (
    tokenExpiresIn: jwt.SignOptions['expiresIn'],
    email?: string,
    id?: number
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const payload = {
            email: email,
            userId: id
        }

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: tokenExpiresIn },
            (err, token) => {
                if (err) {
                    console.log(err, 'token')
                    return reject(err)
                }
                resolve(token as string)
            }
        )
    })
}

export const generateRefreshJWTToken = (
    tokenExpiresIn: jwt.SignOptions['expiresIn'],
    email?: string,
    id?: number
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const payload = {
            email: email,
            userId: id
        }

        jwt.sign(
            payload,
            JWT_REFRESH_SECRET,
            { expiresIn: tokenExpiresIn },
            (err, refresh) => {
                if (err) {
                    console.log(err, 'refresh')
                    return reject(err)
                }
                resolve(refresh as string)
            }
        )
    })
}
