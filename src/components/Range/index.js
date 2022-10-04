const Range = ({rangeVal, setRangeVal, max}) => {
    return <div>
        <input value={rangeVal} onChange={(e) => setRangeVal(e.target.value)} type="range"
               min="1" max={max}/>
        {rangeVal}
        <label>Укажите количество (от 1 до {max})</label>
    </div>
}

export default Range