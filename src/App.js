import React, {useEffect, useState} from 'react';
import './App.css';
import {getProducts} from "./app/api";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {clearDeposit, toDeposit} from "./features/deposit/depositSlice";
import {buyFromStore, moneyExchangeClient, removeFromClient} from "./features/clientBasket/clientBasketSlice";
import Basket from "./components/Basket";
import Modal from "./components/Modal";
import Range from "./components/Range";
import {
    buyFromClient,
    moneyExchangeStore,
    receivedProducts,
    removeFromStore
} from "./features/storeBasket/storeBasketSlice";
import Button from "./components/Button";

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
        else return ""
    }

    const getToModal = (product, type) => {
        if (type === "clientWillBuy") {
            setDepositMode(type)
        }
        if (type === "storeWillBuy") {
            setDepositMode(type)
        }
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

    const checkExchangeParams = () => {
        if (depositMode === "clientWillBuy" && enoughMoneyCheck(clientMoney)) {
            exchange(depositMoney, "toClient")
        }
        if (depositMode === "storeWillBuy" && enoughMoneyCheck(storeMoney)) {
            exchange(depositMoney, "toStore")
        } else if (!enoughMoneyCheck(clientMoney) || !enoughMoneyCheck(storeMoney)) {
            setAlertModal(true)
        }
    }

    const exchange = (moneySum, toWho) => {
        if (toWho === "toClient" && enoughMoneyCheck(clientMoney)) {
            getFromDepositToTarget(depositProducts, toWho)
            dispatch(moneyExchangeStore(moneySum))
            dispatch(moneyExchangeClient(-moneySum))
            setDepositMode(null)
        }
        if (toWho === "toStore" && enoughMoneyCheck(storeMoney)) {
            getFromDepositToTarget(depositProducts, toWho)
            dispatch(moneyExchangeStore(-moneySum))
            dispatch(moneyExchangeClient(moneySum))
            setDepositMode(null)
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
            <Basket title={"Корзина покупателя"}
                    money={clientMoney}
                    items={clientProducts}
                    type={"storeWillBuy"}
                    callback={getToModal}/>

            <Basket title={`Статус покупки/продажи: ${getDepositMode(depositMode)} `}
                    money={depositMoney}
                    items={depositProducts}
            />

            <Basket title={"Корзина продавца"}
                    money={storeMoney}
                    items={storeProducts}
                    type={"clientWillBuy"}
                    callback={getToModal}/>
            {alertModal && <Modal show={alertModal}>Денег не достаточно</Modal>}
            {productForModal && <Modal>
                {productForModal.Name}
                <Range rangeVal={rangeVal} setRangeVal={setRangeVal} max={productForModal.quantity}/>
                <Button callback={() => {
                    getFromModalToDeposit(productForModal, Number(rangeVal))
                    removeProduct(productForModal, Number(rangeVal), depositMode)
                    clearModalStack()
                    setRangeVal(1)
                }}>Подтвердить
                </Button>
            </Modal>}
            {depositMode &&
                <Button callback={() => checkExchangeParams()}>
                    Подтвердить сделку
                </Button>}

        </div>

    );

}

export default App;