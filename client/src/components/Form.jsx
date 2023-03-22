import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

function Form() {

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const { state: { contract, accounts } } = useEth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (inputValue.trim() === '') {
      setError("ERROR: INPUT CANNOT BE EMPTY");
      return;
    }
    console.log({ inputValue });
    try {
      await new Promise((resolve, reject) => {
        contract.methods.castVote(inputValue).send({ from: accounts[0] })
          .once('transactionHash', (hash) => {
            setError('Transaction Hash:\n' + hash.toString());
            console.log('Transaction Hash:', hash);
            resolve(hash);
          })
          .on('error', (error) => {
            console.log('Error:', error);
            reject(error);
          });
      });
    } catch (error) {
      setError(error.message.toString());
    }
  };


  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <label htmlFor="input" className="form-label">
        Ballot: 
        <input id="input" type="text" value={inputValue} onChange={handleChange} className="form-input" size="64" />
      </label>
      <button type="submit" className="my-button">Submit</button>
      <p>{error}</p>
    </form>

  );
}

export default Form;
