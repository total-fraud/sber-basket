import {createSlice} from "@reduxjs/toolkit";
import {buyFrom, moneyExchange, removeProduct} from "../../app/hor";

const initialState = {
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
        }
    }
});

export const {buyFromStore, moneyExchangeClient, removeFromClient} = clientBasketSlice.actions
export default clientBasketSlice.reducer;