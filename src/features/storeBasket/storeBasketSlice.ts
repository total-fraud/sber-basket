import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {buyFrom, moneyExchange, removeProduct, returnProducts} from "../../app/hor";
import {Product} from "../../app/api";

export interface BasketState {
    items: Product[],
    money: number
}

const initialState: BasketState = {
    items: [],
    money: 15000
}

const storeBasketSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        receivedProducts(state, action: PayloadAction<Product[]>) {
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
        },
        returnProductsToStore(state, action) {
            returnProducts(state, action)
        }
    }
});

export const {
    receivedProducts,
    removeFromStore,
    moneyExchangeStore,
    buyFromClient,
    returnProductsToStore
} = storeBasketSlice.actions
export default storeBasketSlice.reducer;