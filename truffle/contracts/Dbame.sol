// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Dbame {

    address private owner;
    bool private electionStarted;
    bool private electionStopped;
    string[] public votes;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    modifier whenElectionStarted() {
        require(electionStarted == true && electionStopped == false, "Election must be started and not stopped.");
        _;
    }

    constructor() {
        owner = msg.sender;
        electionStarted = false;
        electionStopped = false;
    }

    function startElection() public onlyOwner {
        require(!electionStarted, "Election has already been started.");
        electionStarted = true;
    }

    function stopElection() public onlyOwner {
        require(electionStarted && !electionStopped, "Election must be started and not stopped.");
        electionStopped = true;
    }

    function castVote(string calldata vote) public whenElectionStarted {
        votes.push(vote);
    }

    function getAllVotes() external view returns (string[] memory) {
        return votes;
    }

    function isElectionStarted() external view returns (bool) {
        return electionStarted;
    }

    function isElectionStopped() external view returns (bool) {
        return electionStopped;
    }
}
