import {ProductType} from "../app/api";

export const enoughMoneyCheck = (cash: number, depositMoney: number) => {
    return depositMoney < cash
}

export const getDepositMode = (depositMode: ProductType) => {
    if (depositMode === ProductType.ClientWillBuy) return "Покупка"
    if (depositMode === ProductType.StoreWillBuy) return "Продажа"
    else return ""
}
