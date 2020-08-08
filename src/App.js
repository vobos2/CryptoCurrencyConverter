import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";
import Timer from "./Timer";

const BASE_URL = "https://api.binance.com/api/v3/ticker/price";
//const BASE_URL = "";
const base_assets = ["BTC", "USDT", "ETH"];
const BTC = "BTC";
const USDT = "USDT";
const banned_quote_assets = [
  "BCC",
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

  const [dolVal1, setDolVal1] = useState();
  const [dolVal2, setDolVal2] = useState();

  const [amtInFromCurrency, setAmtInFromCurrency] = useState(true);
  // const [state, setstate] = useState(initialState)
  // const [state, setstate] = useState(initialState)

  let toAmount, fromAmount;
  // The amount is entered into first box
  if (amtInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
    // The amount is entered into second box
  } else {
    toAmount = amount;
    fromAmount = amount * exchangeRate;
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
          if (symbol != "") {
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
          }
        });
        setCurrencyDatabase(data);
        setCurrencyOptions([USDT, ...Object.keys(res)]); //, ...Object.keys(data.symbols)

        setFromCurrency(BTC);
        setToCurrency(USDT);
        setExchangeRate(res[BTC][0].price);
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
              console.log(fromCurrency + toCurrency);
              if (foundPair.symbol === fromCurrency + toCurrency) {
                setExchangeRate(foundPair.price);
              } else {
                setExchangeRate(1 / foundPair.price);
              }

              console.log("herepairfound");
            } else {
              if (fromCurrency === toCurrency) {
                setExchangeRate(1);
              } else {
                // We have to convert to btc or dollars and then process
                const btcprice = data.find((c) => c.symbol === BTC + USDT)
                  .price;
                if (toCurrency === USDT) {
                  const exchRate1 = data.find(
                    (c) => c.symbol === fromCurrency + BTC
                  );

                  console.log(exchRate1.price);
                  console.log("TETHER PAIR REQUESTED");
                  setExchangeRate(exchRate1.price * btcprice);
                } else if (fromCurrency === USDT) {
                  console.log("TETHER PAIR REQUESTED FLIPPED");
                  const exchRate1 = data.find(
                    (c) => c.symbol === toCurrency + BTC
                  );
                  setExchangeRate(exchRate1.price * btcprice);
                } else {
                  const exchRate1 = data.find(
                    (c) => c.symbol === fromCurrency + BTC
                  );
                  const exchRate2 = data.find(
                    (c) => c.symbol === toCurrency + BTC
                  );
                  console.log(
                    exchRate1.symbol +
                      +exchRate1.price +
                      "\n " +
                      exchRate2.symbol +
                      exchRate2.price
                  );
                  if (amtInFromCurrency) {
                    setExchangeRate(exchRate1.price / exchRate2.price);
                    console.log("here");
                  } else {
                    setExchangeRate(exchRate2.price / exchRate1.price);
                  }

                  console.log("NOT TETHER");
                }
              }
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
    <div id="main" className="main-container">
      <Timer />
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeAmount={handleFromAmountChange}
        onChangeCurrency={(e) => setFromCurrency(e.target.value)}
        amount={fromAmount}
        dolVal={dolVal1}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeAmount={handleToAmountChange}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        amount={toAmount}
        dolVal={dolVal2}
      />
    </div>
  );
}

export default App;
