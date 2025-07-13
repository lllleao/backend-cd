export const checkTokenFront = (tokenFrontend: string): boolean => {
    if (typeof tokenFrontend === 'string' && tokenFrontend === 'undefined') {
        return false
    }

    if (!tokenFrontend) {
        return false
    }

    return true
}
