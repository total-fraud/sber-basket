import React from "react"
import Button, {BtnTheme} from "../Button";
import "./style.scss"

export interface Modal {
    children: React.ReactNode,
    closeCallback: () => void
}

const Modal: React.FC<Modal> = ({children, closeCallback}) => {
    return <div className="modal">
        <Button theme={BtnTheme.close} callback={() => closeCallback()}>+</Button>
        {children}
    </div>
}

export default Modal