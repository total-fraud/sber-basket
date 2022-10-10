import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BasketState} from "../storeBasket/storeBasketSlice";
import {Product} from "../../app/api";
import {moneyExchange, removeProduct} from "../../app/hor";

export type DepositProduct = {
    product: Product,
    num: number
}

const initialState: BasketState = {
    items: [],
    money: 0
}

const depositSlice = createSlice({
    name: "deposit",
    initialState,
    reducers: {
        toDeposit(state, action: PayloadAction<DepositProduct>) {
            const {product, num} = action.payload
            const findItem = state.items.find((obj) => obj.id === product.id)
            if (findItem) {
                findItem.quantity += num
            } else {
                state.items.push({
                    ...product,
                    quantity: num,
                });
            }
            state.money += product.price * num
        },
        clearDeposit(state) {
            state.items = []
            state.money = 0
        },
        removeFromDeposit(state, action) {
            removeProduct(state, action)
        },
        moneyExchangeDeposit(state, action) {
            moneyExchange(state, action)
        }
    }
});

export const {toDeposit, clearDeposit, removeFromDeposit, moneyExchangeDeposit} = depositSlice.actions
export default depositSlice.reducer;