pragma solidity ^0.8.0;

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

    constructor(string memory name, string memory symbol, uint initialSupply, address shop) {
        _name = name;
        _symbol = symbol;
        owner = msg.sender;
        mint(initialSupply, shop);
    }

    function balanceOf(address account) external {
        return balances[account];
    }

    function transfer(address to, uint amount) external {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount)
    }

    function mint(uint amount, address shop) public onlyOwner {
        _beforeTokenTransfer(address(0), shop, amount);

        balances[shop] += amount;
        totalTokens += amount;
        emit Transfer(address(0), shop, amount);
    }

    function allowance(address _owner, address spender) external view returns(uint) {

    }

    //OpenZeppelin addition
    function _beforeTokenTransfer(address from, address to, uint amount) internal virtual {}



}