import { useState, useEffect } from 'react';

const useFetchCurrency = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const result = await response.json();
          const currencies = Object.values(result.Valute)
          const allCurrencies = [...currencies, 
            {
              "ID": "RUB01010",
              "NumCode": "0361",
              "CharCode": "RUB",
              "Nominal": 1,
              "Name": "Российский рубль",
              "Value": 1,
              "Previous": 1
            }
          ]
          setData(allCurrencies);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании компонента

    return { data, loading, error };
};

export default useFetchCurrency;