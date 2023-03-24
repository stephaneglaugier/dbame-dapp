import React, { useState, useEffect } from 'react';
import useEth from "../contexts/EthContext/useEth";
import '../styles.css';

function VotesDisplay() {
    const [votes, setVotes] = useState([]);
    const [error, setError] = useState('');
    const [displayCount, setDisplayCount] = useState(5);
    const [showMore, setShowMore] = useState(true);
    const [charLimit, setCharLimit] = useState(64);

    const { state: { contract } } = useEth();

    useEffect(() => {
        const updateCharLimit = () => {
            const screenWidth = window.innerWidth;
            const charWidth = 8; // approx width of a character in monospace font
            const limit = Math.min(64, Math.floor(screenWidth * 0.7 / charWidth));
            setCharLimit(limit);
        };

        updateCharLimit();
        window.addEventListener('resize', updateCharLimit);

        return () => {
            window.removeEventListener('resize', updateCharLimit);
        };
    }, []);

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
            {error && <p>{error}</p>}
            {displayedVotes.length > 0 ? (
                <pre>
                    <ul style={{ fontFamily: 'monospace' }}>
                        {displayedVotes.map((vote, index) => (
                            <li key={index} title={vote}>
                                {vote.length > charLimit ? vote.slice(0, charLimit) + '...' : vote}
                            </li>
                        ))}
                    </ul>
                </pre>
            ) : (
                <p style={{ padding: 10 }}>No votes found</p>
            )}
            {votes.length > 5 && (
                <div style={{ padding: 10 }}>
                <button onClick={handleShowMoreClick} className="my-button">
                    {showMore ? 'Show More' : 'Show Less'}
                </button>
                </div>
            )}
            <div style={{ padding: 10 }}>
                <button onClick={handleButtonClick} className="my-button">
                    Show All Votes
                </button>
            </div>
        </div>
    );
};

export default VotesDisplay;
