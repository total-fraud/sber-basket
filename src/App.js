import React, {useEffect} from 'react';
import './App.css';
import {getProducts} from "./app/api";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {receivedProducts} from "./features/storeBasket/storeBasketSlice";
import {buyFromStore} from "./features/clientBasket/clientBasketSlice";

function App() {
    const storeBasketProducts = useAppSelector(state => state.storeBasket.items)
    const storeBasketMoney = useAppSelector(state => state.storeBasket.money)
    const dispatch = useAppDispatch()
    const getFromStore = (product) => {
        console.log(product)
        dispatch(buyFromStore())
    }
    useEffect(() => {
        getProducts().then((products) => {
            dispatch(receivedProducts(products))
        })
    }, [])
    return (
        <div className="App">
            <div className="clientBasket"></div>
            <div className="checkoutBasket"></div>
            <div className="storeBasket">
                <div>Корзина продавца {storeBasketMoney}$</div>
                {storeBasketProducts.map(el => {
                    return <div key={el.id} onClick={() => getFromStore(el)}
                                className="productRow">{`${el.Name}  (${el.quantity})`}</div>
                })}</div>
        </div>
    );
}

export default App;
