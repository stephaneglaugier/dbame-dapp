import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

function Form() {
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const { state: { contract, accounts } } = useEth();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({inputValue1, inputValue2});

    contract.methods.castVote(inputValue1, inputValue2).send({from: accounts[0]});
  };

  const handleChange1 = (event) => {
    setInputValue1(event.target.value);
  };

  const handleChange2 = (event) => {
    setInputValue2(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter Ballot:
        <input type="text" value={inputValue1} onChange={handleChange1} />
        <input type="text" value={inputValue2} onChange={handleChange2} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
