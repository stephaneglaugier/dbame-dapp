import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

function Form() {

	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { state: { contract, accounts } } = useEth();

	function getRPCErrorMessage(err) {
		var open = err.stack.indexOf('{');
		var close = err.stack.lastIndexOf('}');
		var j_s = err.stack.substring(open, close + 1);
		var obj = JSON.parse(j_s);
		return obj;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setSuccess('');
		if (inputValue.trim() === '') {
			setError("ERROR: INPUT CANNOT BE EMPTY");
			return;
		}
		console.log({ inputValue });
		try {
			await contract.methods.castVote(inputValue).call({ from: accounts[0] });
			await new Promise((resolve, reject) => {
				contract.methods.castVote(inputValue).send({ from: accounts[0] })
					.once('transactionHash', (hash) => {
						setSuccess('Transaction Hash:\n' + hash.toString());
						console.log('Transaction Hash:', hash);
						resolve(hash);
					})
					.on('error', (error) => {

						reject(error);
					});
			});
		} catch (error) {
			console.log(error.stack);
			console.log(typeof error.stack);
			const errorObj = getRPCErrorMessage(error);
			console.log(errorObj)
		
			setError(errorObj.originalError.message);
		}
	};

	const handleChange = (event) => {
		setInputValue(event.target.value);
	};

	return (
		<form onSubmit={handleSubmit} style={{ padding: '20px' }}>
			<label htmlFor="input" className="form-label">
				<input id="input" type="text" value={inputValue} onChange={handleChange} className="form-input" size="64" />
			</label>
			<button type="submit" className="my-button">Submit</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{success && <p style={{ color: 'green' }}>{success}</p>}
		</form>
	);
}

export default Form;
