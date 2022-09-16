pragma solidity ^0.8.0;

import "./Erc.sol";

contract Token is ERC20 {
    constructor (address shop) ERC20("BaseToken", "BT", 1000, shop) {

    }

}