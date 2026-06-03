// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TrustScore {
    mapping(address => uint256) public trustScore;
    mapping(address => uint256) public givenTrustCount;
    mapping(address => mapping(address => bool)) public hasTrusted;
    address[] public trustedUsers;
    mapping(address => bool) public isTrustedUser;

    event TrustGiven(address indexed from, address indexed to, uint256 newScore);

    error ZeroAddress();
    error CannotTrustSelf();
    error AlreadyTrusted();

    function giveTrust(address user) external {
        if (user == address(0)) revert ZeroAddress();
        if (user == msg.sender) revert CannotTrustSelf();
        if (hasTrusted[msg.sender][user]) revert AlreadyTrusted();

        hasTrusted[msg.sender][user] = true;
        trustScore[user] += 1;
        givenTrustCount[msg.sender] += 1;

        if (!isTrustedUser[user]) {
            isTrustedUser[user] = true;
            trustedUsers.push(user);
        }

        emit TrustGiven(msg.sender, user, trustScore[user]);
    }

    function getTrustScore(address user) external view returns (uint256) {
        return trustScore[user];
    }

    function getGivenTrustCount(address user) external view returns (uint256) {
        return givenTrustCount[user];
    }

    function hasUserTrusted(address from, address to) external view returns (bool) {
        return hasTrusted[from][to];
    }

    function getTrustedUsers() external view returns (address[] memory) {
        return trustedUsers;
    }

    function trustedUsersLength() external view returns (uint256) {
        return trustedUsers.length;
    }

    function getTrustedUserAt(uint256 index) external view returns (address) {
        return trustedUsers[index];
    }
}
