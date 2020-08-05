import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

const BASE_URL = "https://api.binance.com/api/v3/ticker/price";

const base_assets = ["BTC", "USDT", "ETH"];

const banned_quote_assets = [
  "UP",
  "DOWN",
  "BEAR",
  "BULL",
  "USDC",
  "PAX",
  "TUSD",
  "BUSD",
  "USDS",
];

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currencyDatabase, setCurrencyDatabase] = useState([]);

  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();

  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(1);

  const [amtInFromCurrency, setAmtInFromCurrency] = useState(true);
  // const [state, setstate] = useState(initialState)
  // const [state, setstate] = useState(initialState)

  let toAmount, fromAmount;
  // The amount is entered into first box
  if (amtInFromCurrency) {
    fromAmount = amount;
    if (toCurrency === "USDT") {
      toAmount = amount * exchangeRate;
    } else {
      toAmount = amount / exchangeRate;
    }
    // The amount is entered into second box
  } else {
    toAmount = amount;
    if (toCurrency === "USDT") {
      fromAmount = amount / exchangeRate;
    } else {
      fromAmount = amount * exchangeRate;
    }
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        let res = {};
        data.forEach((sym) => {
          let symbol = sym.symbol;
          let price = sym.price;

          base_assets.forEach((base) => {
            if (symbol.substr(symbol.length - 4).includes(base)) {
              //let removebase = symbol.split(base)[0];
              let quote = symbol.split(base)[0];
              if (!banned_quote_assets.find((b) => quote.includes(b))) {
                if (res[quote]) {
                  res[quote].push({ symbol: symbol, price: price });
                } else {
                  res[quote] = [{ symbol: symbol, price: price }];
                }
              }
            }
          });
        });
        setCurrencyDatabase(data);
        setCurrencyOptions(["USDT", ...Object.keys(res)]); //, ...Object.keys(data.symbols)

        setFromCurrency("BTC");
        setToCurrency("USDT");
        setExchangeRate(res["BTC"][0].price);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(BASE_URL)
        .then((res) => res.json())
        .then((data) => {
          if (data != null) {
            let foundPair = data.find(
              (c) =>
                c.symbol === fromCurrency + toCurrency ||
                c.symbol === toCurrency + fromCurrency
            );
            if (foundPair) {
              console.log(foundPair.price);
              setExchangeRate(foundPair.price);
            } else {
              // We have to convert to btc or dollars and then process
              const btcprice = data.find((c) => c.symbol === "BTCUSDT").price;

              const exchRate1 = data.find(
                (c) => c.symbol === fromCurrency + "BTC"
              ).price;
              const exchRate2 = data.find(
                (c) => c.symbol === toCurrency + "BTC"
              ).price;
              setExchangeRate(exchRate1 / exchRate2);
            }
          }
        });
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmtInFromCurrency(true);
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmtInFromCurrency(false);
  }
  return (
    <div className="main-container">
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeAmount={handleFromAmountChange}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeAmount={handleToAmountChange}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        amount={toAmount}
      />
    </div>
  );
}

export default App;
