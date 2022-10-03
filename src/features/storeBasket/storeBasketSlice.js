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
        }
    }
});

export const { receivedProducts } = storeBasketSlice.actions
export default storeBasketSlice.reducer;