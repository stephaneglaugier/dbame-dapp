// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Dbame {

    string[] public votes;

    function castVote(string calldata vote) public {
        votes.push(vote);
    }

    function getAllVotes() external view returns (string[] memory) {
        return votes;
    }
}
