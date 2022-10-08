import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

const wethAbi = require("./weth.json");

describe("UniswapV2 swap test", function() {
    async function dep() {
        const[deployer] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("TestUniswap");
        const SwapContract = await Factory.deploy();
        await SwapContract.deployed();

        return {SwapContract, deployer}
    }

    it('it works', async function() {
        const abi = [
            "function balanceOf(address owner) view returns (uint balance)"
            ];
        const{SwapContract, deployer} = await loadFixture(dep);
        
        const WETH_ADDR = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
        const contractWETH = new ethers.Contract(WETH_ADDR, wethAbi, deployer);

        const DAI_ADDR = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
        const contractDAI = new ethers.Contract(DAI_ADDR, abi, deployer);


        const amountEth = ethers.utils.parseEther('100');
        const txData = {
            value: amountEth,
            to: WETH_ADDR
        }
        const tx = await deployer.sendTransaction(txData);
        await tx.wait();

        let balance = await contractWETH.balanceOf(deployer.address);
        console.log("start: WETH balance: " + balance);

        await contractWETH.connect(deployer).approve(SwapContract.address, amountEth);

        let swapAmount = ethers.utils.parseEther('50');
        SwapContract.connect(deployer).swap(WETH_ADDR, DAI_ADDR, amountEth, swapAmount, deployer.address);

        balance = await contractDAI.balanceOf(deployer.address);
        console.log('DAI deployer.address: '+balance);


        



    });
});