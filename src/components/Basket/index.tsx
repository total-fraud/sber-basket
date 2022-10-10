import React from "react";
import {Product, ProductType} from "../../app/api";

export interface BasketProps {
    title: string,
    money: number,
    items: Product[],
    type: ProductType,
    callback?: (el: Product, type: ProductType) => void
}

const Basket: React.FC<BasketProps> = ({title, money, items,  type, callback = () => {
        console.log("No action for this list");
    },
                }) => {

    return <div className="basket">
        <div>{title} {money}$</div>
        <div>{items.map(el => {
            return <div key={el.id}
                        onClick={() => callback(el, type)}
                        className="productRow"
            >{`${el.Name} $${el.price} (${el.quantity})`}</div>
        })}</div>
    </div>
}

export default Basket