import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    items: [],
    money: 15000
}

const storeBasketSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        receivedProducts(state, action) {
            const products = action.payload
            products.forEach((product, id) => {
                state.items[id] = product
            })
        },
        removeFromStore(state, action) {
            const {product, num} = action.payload
            const findItem = state.items.find(el => el.id === product.id)
            const findItemIdx = state.items.findIndex(el => el.id === product.id)
            if (findItem.quantity > num) {
                findItem.quantity -= num
            } else {
                state.items.splice(findItemIdx, 1)
            }
        }
    }
});

export const {receivedProducts, removeFromStore} = storeBasketSlice.actions
export default storeBasketSlice.reducer;