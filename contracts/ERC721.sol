// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IERC721Metadata.sol";

contract ERC721 is IERC721Metadata {

    string public name;
    string public symbol;
    mapping(address => uint) _balances;
    mapping(uint => address) _owners;
    mapping(uint =>address) _tokenAprovals;
    mapping(address => mapping(address => bool)) _operatorApprovals;

    modifier _requireMint(uint tokenId) {
        require(_exists(tokenId), "not minted");
        _;
    }

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function _exists(uint tokenId) internal view returns(bool) {
        return _owners[tokenId] != address(0);
    }

    function ownerOf(uint tokenId) public view _requireMint(tokenId) returns(address) {

    }

    function _isApprowedOwner(address spender, uint tokenId) internal view returns(bool) {
        address owner = ownerOf(tokenId);
        require(
            spender==owner ||
            isApprovedForAll(owner, spender) ||
            getApproved(tokenId),
            "not approved or owner"
        );
    }

    function transferFrom(address from, address to, uint tokenId) external {
        require(_isApprovedOwner(msg.sender, tokenId), "not approved or owner");
    }

    


    function safeTransferFrom(address from, address to, uint tokenId) external {

    }






}