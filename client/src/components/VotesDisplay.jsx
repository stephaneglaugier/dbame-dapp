import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";
import '../styles.css';

function VotesDisplay() {
	const [votes, setVotes] = useState([]);
	const [error, setError] = useState('');
	const [displayCount, setDisplayCount] = useState(5);
	const [showMore, setShowMore] = useState(true);

	const { state: { contract } } = useEth();

	const fetchVotes = async () => {
		try {
			const allVotes = await contract.methods.getAllVotes().call();
			setVotes(allVotes);
			setError('');
		} catch (err) {
			setError(err.message.toString());
		}
	};

	const handleButtonClick = async () => {
		await fetchVotes();
	};

	const handleShowMoreClick = () => {
		if (showMore) {
			setDisplayCount(displayCount + 5);
		} else {
			setDisplayCount(5);
		}
		setShowMore(!showMore);
	};

	const displayedVotes = votes.slice(-displayCount);

	return (
		<div>
			<button onClick={handleButtonClick} className="my-button">
				Show All Votes
			</button>
			{votes.length > 5 && (
				<button onClick={handleShowMoreClick} className="my-button">
					{showMore ? 'Show More' : 'Show Less'}
				</button>
			)}
			{error && <p>{error}</p>}
			{displayedVotes.length > 0 ? (
				<ul>
					{displayedVotes.map((vote, index) => (
						<li key={index}>{vote}</li>
					))}
				</ul>
			) : (
				<p>No votes found</p>
			)}
		</div>
	);
}

export default VotesDisplay;