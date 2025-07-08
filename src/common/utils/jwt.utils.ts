// import { NextFunction, Request, Response } from 'express'
// import jwt from 'jsonwebtoken'
// import { AuthenticatedRequest } from '../types'

// const JWT_SECRET = process.env.JWT_SECRET

// const authMiddToken = (
//     req: AuthenticatedRequest,
//     res: Response,
//     next: NextFunction
// ) => {
//     const token = req.cookies?.token
//     if (!token) {
//         return res
//             .status(401)
//             .json({ msg: 'Token ausente, autorização negada' })
//     }

//     jwt.verify(
//         token,
//         JWT_SECRET as string,
//         (err, decoded: { userId: string }) => {
//             if (err) {
//                 return res.status(401).json({ msg: 'Token inválido' })
//             }

//             req.user = decoded.userId
//             next()
//         }
//     )
// }

// export default authMiddToken
