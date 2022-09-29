// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./ERC20.sol";

contract Token is ERC20 {
    constructor () ERC20("BaseToken", "BT", 1000) {}

}

// contract Shop {
//     IERC20 public token;
//     address payable public owner;
//     event Bought(uint _amount, address indexed _buyer);
//     event Sold(uint _amount, address indexed _seller);

//     constructor() {
//         token = new Token(address(this));
//         owner = payable(msg.sender);

//     }
    
//     modifier onlyOwner() {
//         require(msg.sender==owner, "not owner");
//         _;
//     }

//     function sell(uint _sellAmount) external {
//         require(
//             _sellAmount >0 && 
//             token.balanceOf(msg.sender)>= _sellAmount,
//             "bad amount"
//         );

//         uint allowance = token.allowance(msg.sender, address(this));
//         require(allowance >= _sellAmount, "no allowance");

//         token.transferFrom(msg.sender, address(this), _sellAmount);

//         payable(msg.sender).transfer(_sellAmount);
//         emit Sold(_sellAmount, msg.sender);
//     }

//     function tokenBalance() public view returns(uint) {
//         return token.balanceOf(address(this));
//     }


//     receive() external payable {
//         uint tokens2Buy = msg.value;
//         require(tokens2Buy > 0, "low funds");
        
//         require(tokenBalance() >= tokens2Buy, "not enough tokens");
        
//         token.transfer(msg.sender, tokens2Buy);
//         emit Bought(tokens2Buy, msg.sender);
//     }

// }