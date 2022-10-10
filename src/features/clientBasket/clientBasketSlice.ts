import {createSlice} from "@reduxjs/toolkit";
import {buyFrom, moneyExchange, removeProduct, returnProducts} from "../../app/hor";
import {BasketState} from "../storeBasket/storeBasketSlice";


const initialState: BasketState = {
    items: [],
    money: 3000
}

const clientBasketSlice = createSlice({
    name: "clientBasket",
    initialState,
    reducers: {
        buyFromStore(state, action) {
            buyFrom(state, action)
        },
        removeFromClient(state, action) {
            removeProduct(state, action)
        },
        moneyExchangeClient(state, action) {
            moneyExchange(state, action)
        },
        returnProductsToClient(state, action) {
            returnProducts(state, action)
        }
    }
});

export const {buyFromStore, moneyExchangeClient, removeFromClient, returnProductsToClient} = clientBasketSlice.actions
export default clientBasketSlice.reducer;