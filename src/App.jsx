import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { SwapOutlined } from '@ant-design/icons';
import {isOnlyLetters, getTodayDate} from './utils/index.js'
import InputCurrency from './components/InputCurrency.jsx';
import useFetchCurrency from './hooks/useFetchCurrency.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';


let initialState = {
  currency1: {name: '', data: []},
  currency2: {name: '', data: []},
  amount: 1,
  changeInput: false
};

function App() {
  const [state, setState] = useState(initialState);
  const [conversionResult, setConversionResult] = useState(null);

  const { data, isLoading } = useFetchCurrency('https://www.cbr-xml-daily.ru/daily_json.js');

  useEffect(() => {
    if (data) {
      setState(prev => ({...prev, currency1: {name: prev.currency1.name, data: data}}));
      setState(prev => ({...prev, currency2: {name: prev.currency2.name, data: data}}));
    }
  }, [data]);
  
  const calculateConversion = useCallback(() => {
    if (!state.currency1.name && !state.currency2.name) return;
    const currency1 = state.currency1.data.find(val => state.currency1.name.startsWith(val.CharCode));
    const currency2 = state.currency2.data.find(val => state.currency2.name.startsWith(val.CharCode));

    if (currency1 && currency2 && state.amount > 0) {
      const rate = (state.amount * (currency1.Value / currency1.Nominal)) / (currency2.Value / currency2.Nominal);
      setConversionResult(rate.toFixed(2));
    } else {
      setConversionResult(null);
    }
  }
  , [state.amount, state.currency1.data, state.currency1.name, state.currency2.data, state.currency2.name])

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const onChangeInputValue = (e) => {
    const key = e.target.name;
    let newValue = e.target.value.trim();
  
    if (key === 'currency1' || key === 'currency2') {
      if (newValue !== '' && !isOnlyLetters(newValue)) {
        return;
      }
    }
  
    if (key === 'amount') {
      if (newValue < 0) {
        return;
      }
    }
  
    setState(prev => ({
      ...prev,
      [key]: { ...prev[key], name: newValue },
      amount: key === 'amount' ? newValue : prev.amount
    }));
    
    if (key === 'currency1') {
      setState(prev => {
        const filteredCurrencies = data
          ? data.filter(val =>
              val.CharCode.toLowerCase().includes(newValue.toLowerCase()) ||
              val.Name.toLowerCase().includes(newValue.toLowerCase())
            )
          : prev.currency1.data;
  
        return {
          ...prev,
          currency1: { ...prev.currency1, data: filteredCurrencies, name: newValue }
        };
      });
    }
  
    if (key === 'currency2') {
      setState(prev => {
        const filteredCurrencies = data
          ? data.filter(val =>
              val.CharCode.toLowerCase().includes(newValue.toLowerCase()) ||
              val.Name.toLowerCase().includes(newValue.toLowerCase())
            )
          : prev.currency2.data;
  
        return {
          ...prev,
          currency2: { ...prev.currency2, data: filteredCurrencies, name: newValue }
        };
      });
    }
  };
  
  const changeInputs = () => {
    setState(prev => ({
      ...prev,
      currency1: state.currency2,
      currency2: state.currency1,
      changeInput: !state.changeInput
    }));
  }
  
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <h1 className='title'>Курс валют ЦБ РФ</h1>
        <p className='date'>{getTodayDate()}</p>
        <div className="loading">{isLoading && <div>Загрузка...</div>}</div>

        <form className='form'>

            <div className='inp-wrapper'>
              <InputCurrency 
                name='currency1' 
                value={state.currency1.name} 
                onChangeInputValue={onChangeInputValue} 
                filteredValutes={state.currency1.data}
                setState={setState}/>
            </div>

            <div className='arrowToBack' onClick={changeInputs}>
              <SwapOutlined />
            </div>

            <div className='inp-wrapper'>
              <InputCurrency 
                name='currency2' 
                value={state.currency2.name} 
                onChangeInputValue={onChangeInputValue} 
                filteredValutes={state.currency2.data}
                setState={setState}/>
            </div>

          <div className='inp-wrapper'>
            <input type="number" name='amount' className='form-input form-input__amount' value={state.amount} onChange={onChangeInputValue} placeholder='Amount'/>
          </div>

        </form>
        <p className="result">
          {conversionResult !== null ? (
            <>
              {state.amount} {state.currency1.name} <br />
              = <br />
              {conversionResult} {state.currency2.name}
            </>
          ) : (
            'Выберите валюты'
          )}
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default App;