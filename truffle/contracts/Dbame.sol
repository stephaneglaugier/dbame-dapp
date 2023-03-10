// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Dbame {
    bytes32[] public votes;

    function castVote(bytes32 ballot) public {
        votes.push(ballot);
    }

    function getAllVotes() external view returns (bytes32[] memory) {
        return votes;
    }
}
