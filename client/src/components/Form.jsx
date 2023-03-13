import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

function Form() {
  const [inputValue, setInputValue] = useState('');

  const { state: { contract, accounts } } = useEth();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputValue);

    contract.methods.castVote(inputValue).send({from: accounts[0]});
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter Ballot:
        <input type="text" value={inputValue} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
