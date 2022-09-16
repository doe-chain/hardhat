pragma solidity ^0.8.10;

interface IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns(string memory);
    function decimals() external pure returns(uint);
    function totalSupply() external view returns(uint);
    function balanceOf(address account) external view returns(uint);
    function transfer(address to, uint value) external;

    
    function allowance(address owner address spender) external view returns(uint)
    function approve(address spender, uint value) external;
    function transferFrom(address from, address to, uint value) external;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approve(address indexed owner, address indexed to, uint value);
}