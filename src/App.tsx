import React, {useEffect, useState} from 'react';
import './App.scss';
import {getProducts, Product, ProductType} from "./app/api";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {clearDeposit, moneyExchangeDeposit, removeFromDeposit, toDeposit} from "./features/deposit/depositSlice";
import {
    buyFromStore,
    moneyExchangeClient,
    removeFromClient,
    returnProductsToClient
} from "./features/clientBasket/clientBasketSlice";
import Basket from "./components/Basket";
import Modal from "./components/Modal";
import Range from "./components/Range";
import {
    buyFromClient,
    moneyExchangeStore,
    receivedProducts,
    removeFromStore,
    returnProductsToStore
} from "./features/storeBasket/storeBasketSlice";
import Button, {BtnTheme} from "./components/Button";
import useAlert from "./hooks/useAlert";
import {enoughMoneyCheck, getDepositMode} from "./functions";

function App() {
    const storeProducts = useAppSelector(state => state.storeBasket.items)
    const storeMoney = useAppSelector(state => state.storeBasket.money)
    const clientProducts = useAppSelector(state => state.clientBasket.items)
    const clientMoney = useAppSelector(state => state.clientBasket.money)
    const depositProducts = useAppSelector(state => state.deposit.items)
    const depositMoney = useAppSelector(state => state.deposit.money)
    const dispatch = useAppDispatch()

    const [depositMode, setDepositMode] = useState<ProductType>(ProductType.DepositClosed)
    const [rangeVal, setRangeVal] = useState<number>(1)
    const [productForModal, setProductForModal] = useState<Product>()
    const [depositSell, setDepositSell] = useState<boolean>(false)
    const {alert, toggleAlert} = useAlert()

    const getToModal = (product: Product, type: ProductType, depositItem?: boolean): void => {
        setDepositSell(false)
        if (type === ProductType.ClientWillBuy) setDepositMode(type)
        if (type === ProductType.StoreWillBuy) setDepositMode(type)
        if (depositItem) setDepositSell(true)
        setProductForModal(product)
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
        if (depositMode === ProductType.ClientWillBuy && enoughMoneyCheck(clientMoney, depositMoney)) {
            exchange(depositMoney, ProductType.ClientWillBuy)
        }
        if (depositMode === ProductType.StoreWillBuy && enoughMoneyCheck(storeMoney, depositMoney)) {
            exchange(depositMoney, ProductType.StoreWillBuy)
        } else if (!enoughMoneyCheck(clientMoney, depositMoney) || !enoughMoneyCheck(storeMoney, depositMoney)) {
            toggleAlert()
        }
    }

    const exchange = (moneySum: number, toWho: ProductType) => {
        if (toWho === ProductType.ClientWillBuy) {
            dispatch(moneyExchangeStore(moneySum))
            dispatch(moneyExchangeClient(-moneySum))
        }
        if (toWho === ProductType.StoreWillBuy) {
            dispatch(moneyExchangeStore(-moneySum))
            dispatch(moneyExchangeClient(moneySum))
        }
        getFromDepositToTarget(depositProducts, toWho)
        setDepositMode(ProductType.DepositClosed)
    }

    const returnItems = (toWho: ProductType) => {
        const product = productForModal
        const num = Number(rangeVal)
        if (product) {
            setRangeVal(1)
            if (toWho === ProductType.ClientWillBuy) {
                dispatch(returnProductsToStore({product, num}))
            }
            if (toWho === ProductType.StoreWillBuy) {
                dispatch(returnProductsToClient({product, num}))
            }
            dispatch(removeFromDeposit({product, num}))
            dispatch(moneyExchangeDeposit(-(product.price * num)))
            setProductForModal(undefined)
        }
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

            <Basket title={`Статус покупки/продажи: ${getDepositMode(depositMode)} `}
                    money={depositMoney}
                    items={depositProducts} type={ProductType.DepositClosed}
                    deposit={true}
                    callback={getToModal}
            />

            <Basket title={"Корзина продавца"}
                    money={storeMoney}
                    items={storeProducts}
                    type={ProductType.ClientWillBuy}
                    callback={getToModal}/>
            {alert && <Modal closeCallback={() => toggleAlert()}>Денег не достаточно</Modal>}
            {productForModal && <Modal closeCallback={() => setProductForModal(undefined)}>
                {productForModal.Name}
                <Range rangeVal={rangeVal} setRangeVal={setRangeVal} max={productForModal.quantity}/>
                <Button theme={BtnTheme.basic} callback={() => {
                    if (depositSell) {
                        returnItems(depositMode)
                    } else {
                        getFromModalToDeposit(productForModal, Number(rangeVal))
                        removeProduct(productForModal, Number(rangeVal), depositMode)
                        setProductForModal(undefined)
                        setRangeVal(1)
                    }
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