import * as jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET as string

export const generateJWTToken = (
    expiresIn: jwt.SignOptions['expiresIn'],
    email?: string,
    id?: number
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const payload = {
            email: email,
            userId: id
        }

        jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, token) => {
            if (err) {
                console.log(err, 'expirado')
                return reject(err)
            }
            return resolve(token as string)
        })
    })
}
