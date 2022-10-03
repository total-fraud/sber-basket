export const removeProduct = (state, action) => {
    const {product, num} = action.payload
    const findItem = state.items.find(el => el.id === product.id)
    const findItemIdx = state.items.findIndex(el => el.id === product.id)
    if (findItem.quantity > num) {
        findItem.quantity -= num
    } else {
        state.items.splice(findItemIdx, 1)
    }
}

export const moneyExchange = (state, action) => {
    state.money += action.payload
}

export const buyFrom = (state, action) => {
    const products = action.payload
    products.forEach(el => {
        const findItem = state.items.find((obj) => obj.id === el.id)
        if (findItem) {
            findItem.quantity += el.quantity
        } else {
            state.items.push(el);
        }
    })
}