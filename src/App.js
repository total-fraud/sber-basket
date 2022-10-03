import React, {useEffect, useState} from 'react';
import './App.css';
import {getProducts} from "./app/api";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {receivedProducts, removeFromStore} from "./features/storeBasket/storeBasketSlice";
import {clearDeposit, toDeposit} from "./features/deposit/depositSlice";
import {buyFromStore} from "./features/clientBasket/clientBasketSlice";

function App() {
    const storeProducts = useAppSelector(state => state.storeBasket.items)
    const storeMoney = useAppSelector(state => state.storeBasket.money)
    const clientProducts = useAppSelector(state => state.clientBasket.items)
    const clientMoney = useAppSelector(state => state.clientBasket.money)
    const depositProducts = useAppSelector(state => state.deposit.items)
    const depositMoney = useAppSelector(state => state.deposit.money)
    const dispatch = useAppDispatch()

    const [depositMode, setDepositMode] = useState("") //clientWillBuy покупка из магазина, storeWillBuy продажа от клиента
    const [rangeVal, setRangeVal] = useState(1)
    const [productForModal, setProductForModal] = useState()

    const getDepositMode = () => {
        if (depositMode === "clientWillBuy") return "Покупка"
        if (depositMode === "storeWillBuy") return "Продажа"
        else return ""
    }

    const getFromStoreToModal = (product) => {
        setProductForModal(product)
    }

    const getFromModalToDeposit = (product, num) => {
        dispatch(toDeposit({product, num}))
    }

    const removeProductFromStore = (product, num) => {
        dispatch(removeFromStore({product, num}))
    }

    const getFromDepositToClient = (products) => {
        dispatch(clearDeposit())
        dispatch(buyFromStore(products))
    }

    const clearModalStack = () => {
        setProductForModal(null)
    }


    useEffect(() => {
        getProducts().then((products) => {
            dispatch(receivedProducts(products))
        })
    }, [])


    return (<div className="App">
            {productForModal && <div className="modal">
                {productForModal.Name}
                <div><input value={rangeVal} onChange={(e) => setRangeVal(e.target.value)} type="range"
                            min="1" max={productForModal.quantity}/>
                    {rangeVal}
                    <label>Укажите количество (от 1 до {productForModal.quantity})</label>
                </div>
                <button onClick={() => {
                    setDepositMode("clientWillBuy")
                    getFromModalToDeposit(productForModal, Number(rangeVal))
                    removeProductFromStore(productForModal, Number(rangeVal))
                    clearModalStack()
                    setRangeVal(1)
                }}>Подтвердить
                </button>
            </div>}

            {depositMode && <button className="doIt" onClick={() => {
                getFromDepositToClient(depositProducts)

            }}>Подтвердить
                сделку</button>}

            <div className="clientBasket">
                <div>Корзина покупателя {clientMoney}$</div>
                <div>{clientProducts.map(el => {
                    return <div key={el.id}
                                className="productRow">{`${el.Name} $${el.price} (${el.quantity})`}</div>
                })}</div>
            </div>

            <div className="checkoutBasket">
                <div>Статус покупки/продажи: {getDepositMode(depositMode)} {depositMoney}$</div>
                <div>{depositProducts.map(el => {
                    return <div key={el.id}
                                className="productRow">{`${el.Name} $${el.price} (${el.quantity})`}</div>
                })}</div>
            </div>

            <div className="storeBasket">
                <div>Корзина продавца {storeMoney}$</div>
                {storeProducts.map(el => {
                    return <div key={el.id} onClick={() => {
                        getFromStoreToModal(el)
                    }}
                                className="productRow">{`${el.Name} $${el.price} (${el.quantity})`}</div>
                })}</div>
        </div>

    );

}

export default App;