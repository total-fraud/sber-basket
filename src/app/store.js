import { configureStore } from '@reduxjs/toolkit';
import storeBasketReducer from '../features/storeBasket/storeBasketSlice';
import clientBasketReducer from '../features/clientBasket/clientBasketSlice';

export const store = configureStore({
  reducer: {
    storeBasket: storeBasketReducer,
    clientBasket: clientBasketReducer,
  },
});
