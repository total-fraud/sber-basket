import React, {useEffect, useState} from 'react';
import './App.css';
import {getProducts} from "./app/api";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {
    buyFromClient,
    moneyExchangeStore,
    receivedProducts,
    removeFromStore
} from "./features/storeBasket/storeBasketSlice";
import {clearDeposit, toDeposit} from "./features/deposit/depositSlice";
import {buyFromStore, moneyExchangeClient, removeFromClient} from "./features/clientBasket/clientBasketSlice";

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
    const [alertModal, setAlertModal] = useState(false)

    const getDepositMode = () => {
        if (depositMode === "clientWillBuy") return "Покупка"
        if (depositMode === "storeWillBuy") return "Продажа"
    }

    const getToModal = (product) => {
        setProductForModal(product)
    }

    const enoughMoneyCheck = (cash) => {
        return depositMoney < cash
    }

    const getFromModalToDeposit = (product, num) => {
        dispatch(toDeposit({product, num}))
    }

    const removeProduct = (product, num, fromWhere) => {
        if (fromWhere === "clientWillBuy") {
            dispatch(removeFromStore({product, num}))
        }
        if (fromWhere === "storeWillBuy") {
            dispatch(removeFromClient({product, num}))
        }

    }

    const getFromDepositToTarget = (products, toWho) => {
        if (toWho === "toClient") {
            dispatch(clearDeposit())
            dispatch(buyFromStore(products))
        }
        if (toWho === "toStore") {
            dispatch(clearDeposit())
            dispatch(buyFromClient(products))
        }
    }

    const exchange = (moneySum, toWho) => {
        if (toWho === "toClient" && enoughMoneyCheck(clientMoney)) {
            getFromDepositToTarget(depositProducts, toWho)
            dispatch(moneyExchangeStore(moneySum))
            dispatch(moneyExchangeClient(-moneySum))
        }
        if (toWho === "toStore" && enoughMoneyCheck(storeMoney)) {
            getFromDepositToTarget(depositProducts, toWho)
            dispatch(moneyExchangeStore(-moneySum))
            dispatch(moneyExchangeClient(moneySum))
        } else {
            setAlertModal(true)
        }
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
            {alertModal && <div className="modal">Денег не достаточно</div>}
            {productForModal && <div className="modal">
                {productForModal.Name}
                <div><input value={rangeVal} onChange={(e) => setRangeVal(e.target.value)} type="range"
                            min="1" max={productForModal.quantity}/>
                    {rangeVal}
                    <label>Укажите количество (от 1 до {productForModal.quantity})</label>
                </div>
                <button onClick={() => {
                    getFromModalToDeposit(productForModal, Number(rangeVal))
                    removeProduct(productForModal, Number(rangeVal), depositMode)
                    clearModalStack()
                    setRangeVal(1)
                }}>Подтвердить
                </button>
            </div>}

            {depositMode && <button className="doIt" onClick={() => {
                if (depositMode === "clientWillBuy") {
                    exchange(depositMoney, "toClient")
                }
                if (depositMode === "storeWillBuy") {
                    exchange(depositMoney, "toStore")
                }
                setDepositMode(null)
            }}>Подтвердить
                сделку</button>}

            <div className="clientBasket">
                <div>Корзина покупателя {clientMoney}$</div>
                <div>{clientProducts.map(el => {
                    return <div key={el.id}
                                onClick={() => {
                                    setDepositMode("storeWillBuy")
                                    getToModal(el)
                                }}
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
                        setDepositMode("clientWillBuy")
                        getToModal(el)
                    }}
                                className="productRow">{`${el.Name} $${el.price} (${el.quantity})`}</div>
                })}</div>
        </div>

    );

}

export default App;