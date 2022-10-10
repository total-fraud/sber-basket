import React, {Dispatch, SetStateAction} from "react";
import "./style.scss"

export interface RangeProps {
    rangeVal: number,
    setRangeVal: Dispatch<SetStateAction<number>>,
    max: number
}

const Range: React.FC<RangeProps> = ({rangeVal, setRangeVal, max}) => {
    return <div>
        <input className="range" value={rangeVal} onChange={(e) => setRangeVal(Number(e.target.value))} type="range"
               min="1" max={max}/>
        {rangeVal}
        <label>Укажите количество (от 1 до {max})</label>
    </div>
}

export default Range