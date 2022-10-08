const { WETH, DAI, USDC, USDT, WETH_WHALE, DAI_WHALE, USDC_WHALE, USDT_WHALE } = require("./config");

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Minimal test", function () {
    const WHALE = DAI_WHALE;
    const AMOUNT = ethers.utils.parseUnits("10000", 18);

    let tx;
    let balance;
    // const IERC20abi = "./IERC20.json";

    const IERC20abi = [
        "function balanceOf(address owner) view returns (uint balance)",
        "function approve(address spender, uint256 amount)",
        "function transfer(address to, uint amount) returns (bool)",
    ];

    let fromToken;
    let toToken;
    let pair;
    let Contract;

    async function dep() {
        const [deployer] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("UniswapOptimal");
        Contract = await Factory.deploy();
        await Contract.deployed();


        const whaleSigner = await ethers.getImpersonatedSigner(WHALE);

        fromToken = new ethers.Contract(DAI, IERC20abi, whaleSigner);
        toToken = new ethers.Contract(WETH, IERC20abi, whaleSigner);

        pair = new ethers.Contract(
            await Contract.getPair(fromToken.address, toToken.address),
            IERC20abi,
            whaleSigner
        );

        return { Contract, deployer, whaleSigner }



    }

    const balances = async () => {
        return {
            lp: ethers.utils.formatUnits(await pair.balanceOf(Contract.address), 18),
            fromToken: ethers.utils.formatUnits(await fromToken.balanceOf(Contract.address),18),
            toToken: ethers.utils.formatUnits(await toToken.balanceOf(Contract.address),18),
        }
    }
    it('it works', async function () {
        const { Contract, deployer, whaleSigner } = await loadFixture(dep);
        console.log(await balances());
    
        await fromToken.connect(whaleSigner).approve(Contract.address, AMOUNT);

        //tx = await Contract.connect(whaleSigner).zap(fromToken.address, toToken.address, AMOUNT);
        tx = await Contract.connect(whaleSigner).subOptimalZap(fromToken.address, toToken.address, AMOUNT);
        await tx.wait();
        
        console.log(await balances());

    });

});