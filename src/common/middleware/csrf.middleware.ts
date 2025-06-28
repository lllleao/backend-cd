import { NextFunction, Request, Response } from 'express'
import { verifyCsrfToken } from '../../auth/utils/csrf.utils'

const csrfCheck = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['csrf-token'] as string

    if (token && verifyCsrfToken(token)) {
        return next()
    }

    return res.send(403).json({ message: 'CSRF token inválido ou ausente' })
}

export default csrfCheck
