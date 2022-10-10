import {BasketState} from "../features/storeBasket/storeBasketSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {Product} from "./api";

export const removeProduct = (state: BasketState, action:  PayloadAction<{product: Product, num: number}>) => {
    const {product, num} = action.payload
    const findItem = state.items.find(el => el.id === product.id)
    const findItemIdx = state.items.findIndex(el => el.id === product.id)
    if (findItem && findItem.quantity > num) {
        findItem.quantity -= num
    } else {
        state.items.splice(findItemIdx, 1)
    }
}

export const moneyExchange = (state: BasketState, action: PayloadAction<number>) => {
    state.money += action.payload
}

export const buyFrom = (state: BasketState, action: PayloadAction<Product[]>) => {
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