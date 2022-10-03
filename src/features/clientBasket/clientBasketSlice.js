import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    items: [],
    money: 3000
}

const clientBasketSlice = createSlice({
    name: "clientBasket",
    initialState,
    reducers: {
        buyFromStore(state, action) {
            const product = action.payload
            const findItem = state.items.find((obj) => obj.id === product.id)
            if (findItem) {
                findItem.quantity += action.payload.quantity
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: 1,
                });
            }

        }
    }
});

export const {buyFromStore} = clientBasketSlice.actions
export default clientBasketSlice.reducer;