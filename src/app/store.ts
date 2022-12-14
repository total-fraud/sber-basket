import {configureStore} from '@reduxjs/toolkit';
import storeBasketReducer from '../features/storeBasket/storeBasketSlice';
import clientBasketReducer from '../features/clientBasket/clientBasketSlice';
import depositReducer from '../features/deposit/depositSlice';

export const store = configureStore({
    reducer: {
        storeBasket: storeBasketReducer,
        clientBasket: clientBasketReducer,
        deposit: depositReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch