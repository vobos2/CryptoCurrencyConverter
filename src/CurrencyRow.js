import React from "react";

function CurrencyRow(props) {
  const {
    currencyDB,
    currencyOptions,
    selectedCurrency,
    onChangeCurrency,
    amount,
    onChangeAmount,
    dolVal
  } = props;

  return (
    <div>
      <input
        type="number"
        className="input"
        value={amount}
        onChange={onChangeAmount}
      />
      <select value={selectedCurrency} onChange={onChangeCurrency}>
        {currencyOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <small>{dolVal}</small>
    </div>
  );
}

export default CurrencyRow;
