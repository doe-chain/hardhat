// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    address owner;
    uint totalTokens;
    mapping(address=>uint) balances;
    mapping(address=>mapping(address=>uint)) allowances;

    string _name;
    string _symbol;

    function name() external view returns(string memory) {
        return _name;
    }

    function symbol() external view returns(string memory) {
        return _symbol;
    }

    function decimals() external pure returns(uint) {
        return 18;//1 = 1 wei
    }

    function totalSupply() external view returns(uint) {
        return totalTokens;
    }

    modifier enoughTokens(address _from, uint _amount) {
        require(balanceOf(_from) >= _amount, "no tokens");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender==owner, "not owner");
        _;
    }

    constructor(string memory name_, string memory symbol_, uint initialSupply) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        mint(initialSupply, owner);
    }

    function balanceOf(address account) public view returns(uint)  {
        return balances[account];
    }

    function transfer(address to, uint amount) external enoughTokens(msg.sender, amount) {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function mint(uint amount, address shop) public onlyOwner {
        _beforeTokenTransfer(address(0), shop, amount);

        balances[shop] += amount;
        totalTokens += amount;
        emit Transfer(address(0), shop, amount);
    }

    function burn(address from, uint amount) public onlyOwner {
        _beforeTokenTransfer(from, address(0), amount);
        require(balances[from] >= amount, "no amount to burn");
        balances[from] -= amount;
        totalTokens -= amount;
    }

    function allowance(address _owner, address spender) public view returns(uint) {
        return allowances[_owner][spender];
    }

    function approve(address spender, uint amount) public {
        allowances[msg.sender][spender] = amount;
        emit Approve(msg.sender, spender, amount);
        
    }

    function transferFrom(address from, address to, uint amount) external enoughTokens(from, amount) {
        _beforeTokenTransfer(from, to, amount);
        require(allowances[from][to] >= amount, "no allowance");
        allowances[from][to] -= amount;

        balances[from] -= amount;
        balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    //OpenZeppelin addition
    function _beforeTokenTransfer(address from, address to, uint amount) internal virtual {}



}