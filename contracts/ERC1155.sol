// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IERC1155.sol";
import "./IERC1155MetadataURI.sol";
import "./IERC1155Receiver.sol";

contract ERC1155 is IERC1155, IERC1155MetadataUri {

    mapping(uint => mapping(address => uint)) private _balances;
    mapping(address => mapping(address=>bool)) private _operatorApprovals;
    string private _uri;

    constructor(string memory uri_) {
        //@todo _setUri function
        //_setUri(uri_);
    }

    function uri(uint) external view virtual returns(string memory) {
        return _uri;
    }

    
    function balanceOf(address account, uint id) public view returns(uint) {
        require(account!=address(0));
        return _balances[id][account];
    }

    function balanceOfBatch(
        address[] calldata accounts, 
        uint[] calldata ids
    ) external view returns(uint[] memory batchBalances) {
        require(accounts.length == ids.length);
        batchBalances = new uint[](accounts.length);
        for (uint i = 0; i< accounts.length; i++) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);

        }          
        return batchBalances;
    }


}