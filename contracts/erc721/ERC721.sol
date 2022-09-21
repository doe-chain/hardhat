// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IERC721.sol";
import "./IERC721Metadata.sol";
import "./IERC721Receiver.sol";

import "./ERC165.sol";

import "./Strings.sol";

contract ERC721 is IERC721, ERC165
{
    using Strings for uint;

    string public _name;
    string public _symbol;
    mapping(address => uint) _balances;
    mapping(uint => address) _owners;
    mapping(uint =>address) _tokenApprovals;
    mapping(address => mapping(address => bool)) _operatorApprovals;

    modifier _requireMint(uint tokenId) {
        require(_exists(tokenId), "not minted");
        _;
    }

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function name() external view returns(string memory) {
        return _name;
    }

    function symbol() external view returns(string memory) {
        return _symbol;
    }



    function balanceOf(address owner) public view returns(uint) {
        require(owner != address(0), "null address");
        return _balances[owner];
    }

    function _exists(uint tokenId) internal view returns(bool) {
        return _owners[tokenId] != address(0);
    }

    function ownerOf(uint tokenId) public view _requireMint(tokenId) returns(address) {
        return _owners[tokenId];
    }

    function _baseUri() internal pure virtual returns(string memory) {
        return "";
    }

    function supportsInterface(bytes4 interfaceId) public view override returns(bool) {
        return interfaceId == type(IERC721).interfaceId || super.supportsInterface(interfaceId);
    }

    //ipfs://baseurl
    function tokenUri(uint tokenId) public view _requireMint(tokenId) returns(string memory) {
        string memory baseURI = _baseUri();
        return bytes(baseURI).length > 0 ?
            string(abi.encodePacked(baseURI, tokenId.toString())) :
            ""; 
    }   

    function approve(address to, uint tokenId) public {
        address _owner = ownerOf(tokenId);
        require(_owner == msg.sender || isApprovedForAll(_owner, msg.sender), "not an owner");

        require(to!=_owner, "cannot self approve");
        _tokenApprovals[tokenId] = to;
        emit Approval(_owner, to, tokenId);
    }
    
    function setApprovalForAll(address operator, bool approved) public {
        require(msg.sender != operator, "cannot approve to self");

        _operatorApprovals[msg.sender][operator] = approved;

        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint tokenId) public view _requireMint(tokenId) returns(address) {
        return _tokenApprovals[tokenId];
    }
    function isApprovedForAll(address owner, address operator) public view returns(bool) {
        return _operatorApprovals[owner][operator];
    }


    function burn(uint tokenId) public virtual {
        require(_isApprovedOrOwner(msg.sender, tokenId), "not approved or owner");
        address owner = ownerOf(tokenId);

        delete _tokenApprovals[tokenId];

        _balances[owner]--;

        delete _owners[tokenId];
    }

    function _safeMint(address to, uint tokenId) internal virtual {
        _mint(to, tokenId);

        require(_checkOnERC721Received(msg.sender, to, tokenId), "cant recieve erc721");
    }

    function _mint(address to, uint tokenId) internal virtual {
        require(to != address(0), "to address cannot be null");
        require(!_exists(tokenId), "token exists");

        _owners[tokenId] = to;
        _balances[to]++;
    }


    function _isApprovedOrOwner(address spender, uint tokenId) internal view returns(bool) {
        address owner = ownerOf(tokenId);
        return (
            spender==owner ||
            isApprovedForAll(owner, spender) ||
            getApproved(tokenId)==spender
        );
    }

    function _safeTransfer(address from, address to, uint tokenId) internal {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId), "cant recieve erc721");

    }
    function _checkOnERC721Received(address from, address to, uint tokenId) private returns(bool) {
        //check if address is smartcontract, and if it can receive erc721
        if(to.code.length >0) {
            try  IERC721Receiver(to).onERC721Received (msg.sender, from , tokenId, bytes("")) returns(bytes4 ret) {
                return ret == IERC721Receiver.onERC721Received.selector;
            } catch(bytes memory reason)  {
                if(reason.length==0) {
                    //no realised ERC721 interface
                    revert("No erc721 reciever");
                }
                else {
                    //in first 32 bytes - is strlenght
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
        else {
            return true;
        }
    }

    function _transfer(address from, address to, uint tokenId) internal {
        require(ownerOf(tokenId)==from, "not an owner");
        require(to != address(0), "to cannot be null address");
        _beforeTokenTransfer(from, to, tokenId);
        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
        _afterTokenTransfer(from, to, tokenId);
    }
    
    function _beforeTokenTransfer(address from, address to, uint tokenId) internal {}
    
    function _afterTokenTransfer(address from, address to, uint tokenId) internal {}



    function transferFrom(address from, address to, uint tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "not approved or owner");
        _transfer(from, to, tokenId);
    }

    
    


    function safeTransferFrom(address from, address to, uint tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "not approved or owner");

        _safeTransfer(from, to, tokenId);
    }







}