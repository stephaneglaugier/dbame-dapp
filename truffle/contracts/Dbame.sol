// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Dbame {
    struct Vote {
        bytes32[2] vote;
    }

    bytes32[2][] public votes;

    function castVote(bytes32 option1, bytes32 option2) public {
        votes.push([option1, option2]);
    }

    function getAllVotes() external view returns (bytes32[2][] memory) {
        return votes;
    }
}
