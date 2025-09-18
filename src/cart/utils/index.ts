export const calcFrete = (totalPrice: number) => {
    if (totalPrice >= 50) return totalPrice
    return totalPrice + 10
}
