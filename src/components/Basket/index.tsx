import React from "react";
import {Product, ProductType} from "../../app/api";
import "./style.scss"

export interface BasketProps {
    title: string,
    money: number,
    items: Product[],
    type: ProductType,
    callback: (el: Product, type: ProductType, deposit?: boolean) => void,
    deposit?: boolean
}

const Basket: React.FC<BasketProps> = ({title, money, items, type, callback, deposit
                                       }) => {

    return <div className="basket">
        <div>{title} {money}$</div>
        <div className="basketBody">{items.map(el => {
            return <div key={el.id}
                        onClick={() => callback(el, type, deposit)}
                        className="productRow"
            >{`${el.Name} $${el.price} (${el.quantity})`}</div>
        })}</div>
    </div>
}

export default Basket