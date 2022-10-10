import React from "react";

export enum BtnTheme {
    close = "close",
    basic = "basic"
}

export interface ButtonProps {
    children: string,
    callback: () => void,
    theme?: BtnTheme
}

const Button: React.FC<ButtonProps> = ({callback, children, theme= BtnTheme.basic}) => {
    return <button className={theme} onClick={() => {
        callback()
    }}>
        {children}
    </button>
}

export default Button