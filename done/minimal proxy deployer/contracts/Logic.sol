// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Logic {
    address public implementation;
    uint public x;

    function plus() external {
        x += 1;
    }

    function minus() external {
        x -= 1;
    }
}