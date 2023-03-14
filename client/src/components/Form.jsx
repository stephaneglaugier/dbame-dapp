import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

function Form() {

  const Web3 = require('web3');
  const web3 = new Web3();

  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [error, setError] = useState('');

  const { state: { contract, accounts } } = useEth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const part1 = "0x" + inputValue1;
    const part2 = "0x" + inputValue2
    console.log({ part1, part2 });
    if (!web3.utils.isHexStrict(part1) || !web3.utils.isHexStrict(part2)) {
      setError("INVALID HEX STRING");
      return;
    }
    try {
      await new Promise((resolve, reject) => {
        contract.methods.castVote(part1, part2).send({ from: accounts[0] })
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


  const handleChange1 = (event) => {
    setInputValue1(event.target.value);
  };

  const handleChange2 = (event) => {
    setInputValue2(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <label htmlFor="input1" className="form-label">
        Part 1: 0x
        <input id="input1" type="text" value={inputValue1} onChange={handleChange1} className="form-input" size="64" />
      </label>
      <label htmlFor="input2" className="form-label">
        Part 2: 0x
        <input id="input2" type="text" value={inputValue2} onChange={handleChange2} className="form-input" size="64" />
      </label>
      <button type="submit" className="form-button">Submit</button>
      <p>{error}</p>
    </form>

  );
}

export default Form;
