import React, {useEffect, useState} from 'react';
import './App.css';
import {getProducts, Product, ProductType} from "./app/api";
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
import Button, {BtnTheme} from "./components/Button";

function App() {
    const storeProducts = useAppSelector(state => state.storeBasket.items)
    const storeMoney = useAppSelector(state => state.storeBasket.money)
    const clientProducts = useAppSelector(state => state.clientBasket.items)
    const clientMoney = useAppSelector(state => state.clientBasket.money)
    const depositProducts = useAppSelector(state => state.deposit.items)
    const depositMoney = useAppSelector(state => state.deposit.money)
    const dispatch = useAppDispatch()


    const [depositMode, setDepositMode] = useState<ProductType>() //clientWillBuy покупка из магазина, storeWillBuy продажа от клиента
    const [rangeVal, setRangeVal] = useState<number>(1)
    const [productForModal, setProductForModal] = useState<Product>()
    const [alertModal, setAlertModal] = useState(false)

    const getDepositMode = () => {
        if (depositMode === ProductType.ClientWillBuy) return "Покупка"
        if (depositMode === ProductType.StoreWillBuy) return "Продажа"
        else return ""
    }


    const getToModal = (product: Product, type: ProductType): void => {
        if (type === ProductType.ClientWillBuy) {
            setDepositMode(type)
        }
        if (type === ProductType.StoreWillBuy) {
            setDepositMode(type)
        }
        setProductForModal(product)
    }

    const enoughMoneyCheck = (cash: number) => {
        return depositMoney < cash
    }

    const getFromModalToDeposit = (product: Product, num: number) => {
        dispatch(toDeposit({product, num}))
    }

    const removeProduct = (product: Product | undefined, num: number, fromWhere: ProductType | undefined) => {
        if (fromWhere === ProductType.ClientWillBuy) {
            dispatch(removeFromStore({product, num}))
        }
        if (fromWhere === ProductType.StoreWillBuy) {
            dispatch(removeFromClient({product, num}))
        } else return

    }

    const getFromDepositToTarget = (products: Product[], toWho: ProductType) => {
        if (toWho === ProductType.ClientWillBuy) {
            dispatch(clearDeposit())
            dispatch(buyFromStore(products))
        }
        if (toWho === ProductType.StoreWillBuy) {
            dispatch(clearDeposit())
            dispatch(buyFromClient(products))
        }
    }

    const checkExchangeParams = () => {
        if (depositMode === ProductType.ClientWillBuy && enoughMoneyCheck(clientMoney)) {
            exchange(depositMoney, ProductType.ClientWillBuy)
        }
        if (depositMode === ProductType.StoreWillBuy && enoughMoneyCheck(storeMoney)) {
            exchange(depositMoney, ProductType.StoreWillBuy)
        } else if (!enoughMoneyCheck(clientMoney) || !enoughMoneyCheck(storeMoney)) {
            setAlertModal(true)
        }
    }

    const exchange = (moneySum: number, toWho: ProductType) => {
        if (toWho === ProductType.ClientWillBuy && enoughMoneyCheck(clientMoney)) {
            getFromDepositToTarget(depositProducts, toWho)
            dispatch(moneyExchangeStore(moneySum))
            dispatch(moneyExchangeClient(-moneySum))
            setDepositMode(ProductType.DepositClosed)
        }
        if (toWho === ProductType.StoreWillBuy && enoughMoneyCheck(storeMoney)) {
            getFromDepositToTarget(depositProducts, toWho)
            dispatch(moneyExchangeStore(-moneySum))
            dispatch(moneyExchangeClient(moneySum))
            setDepositMode(ProductType.DepositClosed)
        }
    }

    const clearModalStack = () => {
        setProductForModal(undefined)
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
                    type={ProductType.StoreWillBuy}
                    callback={getToModal}/>

            <Basket title={`Статус покупки/продажи: ${getDepositMode()} `}
                    money={depositMoney}
                    items={depositProducts} type={ProductType.DepositClosed}/>

            <Basket title={"Корзина продавца"}
                    money={storeMoney}
                    items={storeProducts}
                    type={ProductType.ClientWillBuy}
                    callback={getToModal}/>
            {alertModal && <Modal closeCallback={() => setAlertModal(false)}>Денег не достаточно</Modal>}
            {productForModal && <Modal closeCallback={() => clearModalStack()}>
                {productForModal.Name}
                <Range rangeVal={rangeVal} setRangeVal={setRangeVal} max={productForModal.quantity}/>
                <Button theme={BtnTheme.basic} callback={() => {
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