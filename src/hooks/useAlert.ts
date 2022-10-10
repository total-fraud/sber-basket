import {useState} from "react";

const useAlert = () => {
    const [alert, setAlert] = useState(false)
    const toggleAlert = () => {
        if (!alert) {
            setAlert(true)
        } else {
            setAlert(false)
        }
    }

    return {
        alert, toggleAlert
    }
}

export default useAlert