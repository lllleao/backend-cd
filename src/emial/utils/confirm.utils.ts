import { Response } from 'express'
import { join } from 'path'

export type ResultKeys = 'userExist' | 'accountVerified' | 'success'

const results: Record<ResultKeys, (res: Response) => void> = {
    userExist: (res: Response) => {
        return res.sendFile(
            join(
                __dirname,
                '..',
                '..',
                '..',
                'public',
                'userEmpty',
                'index.html'
            )
        )
    },
    accountVerified: (res: Response) => {
        return res.sendFile(
            join(
                __dirname,
                '..',
                '..',
                '..',
                'public',
                'errorToken',
                'index.html'
            )
        )
    },
    success: (res: Response) => {
        return res.sendFile(
            join(__dirname, '..', '..', '..', 'public', 'success', 'index.html')
        )
    }
}

export default results
