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
            const products = action.payload
            products.forEach(el => {
                const findItem = state.items.find((obj) => obj.id === el.id)
                if (findItem) {
                    findItem.quantity += action.payload.quantity
                } else {
                    state.items.push(el);
                }
            })



        }
    }
});

export const {buyFromStore} = clientBasketSlice.actions
export default clientBasketSlice.reducer;