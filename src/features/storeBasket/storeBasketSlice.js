import {createSlice} from "@reduxjs/toolkit";
import {buyFrom, moneyExchange, removeProduct} from "../../app/hor";

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
        buyFromClient(state, action) {
            buyFrom(state, action)
        },
        removeFromStore(state, action) {
            removeProduct(state, action)
        },
        moneyExchangeStore(state, action) {
            moneyExchange(state, action)
        }
    }
});

export const {receivedProducts, removeFromStore, moneyExchangeStore, buyFromClient} = storeBasketSlice.actions
export default storeBasketSlice.reducer;