// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./IERC1155.sol";

interface IERC1155MetadataUri is IERC1155 {
    function uri(uint id) external view returns(string memory);
}
