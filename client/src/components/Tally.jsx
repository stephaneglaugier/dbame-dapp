import React, { useState } from 'react';
import bigInt from 'big-integer';
import useEth from "../contexts/EthContext/useEth";

const DEFAULT_RADIX = 16;

const decryptBallot = (c3, c4, p, xm, xr) => {
	const _P = bigInt(p, DEFAULT_RADIX);
	const _xm = bigInt(xm, DEFAULT_RADIX);
	const _xr = bigInt(xr, DEFAULT_RADIX);
	const _C3 = bigInt(c3, DEFAULT_RADIX);
	const _C4 = bigInt(c4, DEFAULT_RADIX);

	const c3_inverse_xm = _C3.modPow(_xm.negate(), _P);
	const c3_inverse_xr = _C3.modPow(_xr.negate(), _P);

	const product = c3_inverse_xm.multiply(c3_inverse_xr).mod(_P);

	const _BALLOT = _C4.multiply(product).mod(_P);

	return { ballot: _BALLOT.toString(DEFAULT_RADIX) };
};

const Tally = () => {
	const { state: { contract } } = useEth();

	const [url, setUrl] = useState('http://192.168.0.4:8080');
	const [votesDisplayed, setVotesDisplayed] = useState([]);
	const [tallyResults, setTallyResults] = useState([]);

	const [error, setError] = useState(null);

	const handleButtonClick = async () => {
		setError(null);
		try {
			const response = await fetch(`${url}/registrar/closed`);
			if (!response.ok) {
				throw new Error(`An error occurred: ${response.statusText}`);
			}
			const { p, candidates, xM, xR, ballots } = await response.json();

			const votes = await contract.methods.getAllVotes().call();
			const validDecryptedVotesMap = new Map();

			votes.forEach((vote) => {
				const parts = vote.split('.');
				if (parts.length !== 2) return;
				try {
					const [c3, c4] = parts;
					const decryptedBallot = decryptBallot(c3, c4, p, xM, xR);
					var decryptedBallotString = decryptedBallot.ballot.toString();
					if (decryptedBallotString.length < 32) {
						decryptedBallotString = decryptedBallotString.padStart(32, '0');
					}
					if (decryptedBallotString.length === 32) {
						const ballotId = decryptedBallotString.slice(0, 24);
						validDecryptedVotesMap.set(ballotId, decryptedBallotString);
					}
				} catch (err) {
					// Ignore invalid vote strings
				}
			});

			const tally = candidates.map(() => 0);
			const slicedBallots = ballots.map((ballot) => ballot.slice(0, 24));

			console.log(validDecryptedVotesMap)
			const validDecryptedVotes = Array.from(validDecryptedVotesMap.values());
			setVotesDisplayed(validDecryptedVotes);

			console.log(validDecryptedVotes.toString());
			validDecryptedVotes.forEach((vote) => {
				const ballotId = vote.slice(0, 24);
				const voteData = vote.slice(24);

				if (slicedBallots.includes(ballotId)) {
					var binaryVoteData = parseInt(voteData, 16).toString(2);
					if (binaryVoteData.length < 32) {
						binaryVoteData = binaryVoteData.padStart(32, '0');
					}
					binaryVoteData.split('').forEach((bit, index) => {
						if (bit === '1' && index < candidates.length) {
							tally[index]++;
						}
					});
				}
			});

			console.log('Tally:', tally);
			setTallyResults(tally.map((voteCount, index) => ({
				candidate: candidates[index],
				votes: voteCount,
			})));
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
	};

	const highestVoteCount = Math.max(...tallyResults.map(result => result.votes));

	const winners = tallyResults.filter(
		result => result.votes === highestVoteCount
	);

	return (
		<div>
			<div style={{ padding: 10 }}>
				<input
					id="input"
					type="text"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Enter registrar URL"
					className="form-input"
					size="64"
				/>
			</div>
			<div style={{ padding: 10 }}>
				<button onClick={handleButtonClick} className="my-button">
					Count Votes
				</button>
			</div>
			{error && <p className="error-message">{error}</p>}
			<div>
			{votesDisplayed.length > 0 && (
			<div style={{ padding: 10 }}>
					<h2>Decrypted Ballots:</h2>
					<ul>
						{votesDisplayed.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</div>)}

				{tallyResults.length > 0 && (
				<div style={{ padding: 10 }}>
					<h2>Results:</h2>
					<ul>
						{tallyResults.map((result, index) => (
							<li key={index} style={{ fontWeight: winners.some(winner => winner.candidate === result.candidate) ? 'bold' : 'normal' }}>
								{result.candidate}: {result.votes} vote(s) {winners.some(winner => winner.candidate === result.candidate) && '(Winner)'}
							</li>
						))}
					</ul>
				</div>)}
			</div>
		</div>
	);
};

export default Tally;
