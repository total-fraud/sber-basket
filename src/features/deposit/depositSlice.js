import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    items: [],
    money: 0
}

const depositSlice = createSlice({
    name: "deposit",
    initialState,
    reducers: {
        toDeposit(state, action) {
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
        }
    }
});

export const {toDeposit, clearDeposit} = depositSlice.actions
export default depositSlice.reducer;