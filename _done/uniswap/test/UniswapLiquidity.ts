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

        const FactoryL = await ethers.getContractFactory("UniswapLiquidity");
        const LiquidityContract = await FactoryL.deploy();
        await LiquidityContract.deployed();

        return {SwapContract, LiquidityContract, deployer}
    }

    it('it works', async function() {
        const abi = [
            "function balanceOf(address owner) view returns (uint balance)",
            "function approve(address spender, uint256 amount)"
            ];
        const{SwapContract, LiquidityContract, deployer} = await loadFixture(dep);
        
        const WETH_ADDR = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
        const contractWETH = new ethers.Contract(WETH_ADDR, wethAbi, deployer);

        const DAI_ADDR = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
        const contractDAI = new ethers.Contract(DAI_ADDR, abi, deployer);


        const amountEth = ethers.utils.parseEther('100');
        const txData = {
            value: amountEth,
            to: WETH_ADDR
        }
        let tx = await deployer.sendTransaction(txData);
        await tx.wait();

        let balance = await contractWETH.balanceOf(deployer.address);
        console.log("start: WETH balance: " + ethers.utils.formatEther( balance));

        await contractWETH.connect(deployer).approve(SwapContract.address, amountEth);

        let swapAmount = ethers.utils.parseEther('50');
        await SwapContract.connect(deployer).swap(WETH_ADDR, DAI_ADDR, amountEth, swapAmount, deployer.address);

        const balanceDAI = await contractDAI.balanceOf(deployer.address);
        console.log('DAI deployer.address: '+ethers.utils.formatEther( balanceDAI));

        await contractWETH.connect(deployer).approve(LiquidityContract.address, amountEth);
        await contractDAI.connect(deployer).approve(LiquidityContract.address, balanceDAI);

        // console.log(LiquidityContract);

        tx = await LiquidityContract.connect(deployer).addLiquidity(
            WETH_ADDR,
            DAI_ADDR,
            ethers.utils.parseEther('5'),
            balanceDAI
        );
        await tx.wait();

        let answer = ethers.utils.defaultAbiCoder.decode(
            ['uint256', 'uint256', 'uint256'],
            ethers.utils.hexDataSlice(tx.data, 4)
        );
        for (let index = 0; index < answer.length; index++) {
            console.log(answer[index]);
        }        
        // console.log(answer);

        tx = await LiquidityContract.connect(deployer).removeLiquidity(
            WETH_ADDR,
            DAI_ADDR,
        );
        await tx.wait();

        answer = ethers.utils.defaultAbiCoder.decode(
            ['uint256', 'uint256'],
            ethers.utils.hexDataSlice(tx.data, 4)
        );

        for (let index = 0; index < answer.length; index++) {
            console.log(answer[index]);
        }

    });
});