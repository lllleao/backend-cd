type FilterSkiperType = {
    publicBooks?: boolean
    storeBooks?: boolean
    payPixLimit?: boolean
    isPaidLimit?: boolean
    getCsrfTokenLimit?: boolean
    verifyCsrfTokenLimit?: boolean
    refreshLimit?: boolean
    addLimit?: boolean
    itemsLimit?: boolean
    deleteLimit?: boolean
    deleteAllLimit?: boolean
    updatePriceLimit?: boolean
    createPurchaseLimit?: boolean
    purchasePaidLimit?: boolean
    sendLimit?: boolean
    confirmLimit?: boolean
    signupLimit?: boolean
    loginLimit?: boolean
    profileLimit?: boolean
    logoutLimit?: boolean
    createAddressLimit?: boolean
    getAddressLimit?: boolean
}

export const filterSkipThrottler = (permited: string): FilterSkiperType[] => {
    const blockThrottller = [
        {
            publicBooks: true
        },
        { getCookieLimit: true },
        {
            storeBooks: true
        },
        {
            payPixLimit: true
        },
        {
            isPaidLimit: true
        },
        {
            getCsrfTokenLimit: true
        },
        {
            verifyCsrfTokenLimit: true
        },
        {
            refreshLimit: true
        },
        {
            addLimit: true
        },
        {
            itemsLimit: true
        },
        {
            deleteLimit: true
        },
        {
            deleteAllLimit: true
        },
        {
            updatePriceLimit: true
        },
        {
            createPurchaseLimit: true
        },
        {
            purchasePaidLimit: true
        },
        {
            sendLimit: true
        },
        {
            confirmLimit: true
        },
        {
            signupLimit: true
        },
        {
            loginLimit: true
        },
        {
            profileLimit: true
        },
        {
            logoutLimit: true
        },
        {
            createAddressLimit: true
        },
        {
            getAddressLimit: true
        }
    ]

    const teste = blockThrottller.filter(
        (item) => !Object.prototype.hasOwnProperty.call(item, permited)
    )

    return teste
}
