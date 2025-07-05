import { Transform } from 'class-transformer'

export const Trim = () =>
    Transform(({ value }): string | undefined => {
        if (typeof value === 'string') {
            const trimmed = value.trim()
            return trimmed === '' ? undefined : trimmed
        }
        return value
    })
