/* eslint-disable react/prop-types */
import { useState } from "react"
import { selectCurrency } from "../utils/index"
import '../App.css';


export default function InputCurrency({name, value, onChangeInputValue, filteredValutes, setState}) {
  const [isShowList, setIsShowList] = useState()
  return (
    <>
      <input 
                  key={name}
                  type="search" 
                  name={name}
                  className='form-input' 
                  value={value} 
                  onChange={onChangeInputValue} 
                  onFocus={() => setIsShowList(true)} 
                  onBlur={() => setTimeout(() => setIsShowList(false), 200)}
                  placeholder='Выберите валюту'
                />
                {(isShowList && filteredValutes.length > 0) && 
                  <ul id={name} className='list'>
                    {filteredValutes.map(val => (
                      <li key={val.ID} onMouseDown={() => selectCurrency(name, val.CharCode, val.Name, setState)}>
                        <b>{val.CharCode}</b> {val.Name}
                      </li>
                    ))}
                  </ul>}
    </>
  )
}
