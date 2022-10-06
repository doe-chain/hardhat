import './test-config';
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

// const erc20abi = [
//     "function balanceOf(address owner) view returns (uint balance)",
//     "function approve(address spender, uint256 amount)",
//     "function transfer(address to, uint amount) returns (bool)",
// ];

const erc20abi = [
    "function balanceOf(address owner) view returns (uint balance)",
    "function approve(address spender, uint256 amount)",
    "function transfer(address to, uint amount) returns (bool)",
];


const USDC_WHALE = "0x55fe002aeff02f77364de339a1292923a15844b8";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";


describe("Minimal test", function() {
    const bn = ethers.BigNumber;
    const TOKEN_BORROW = USDC;
    const TOKEN_WHALE = USDC_WHALE;
    const DECIMALS = 6;
    const FUND_AMOUNT = ethers.utils.parseUnits("1000", DECIMALS);
    const BORROW_AMOUNT = ethers.utils.parseUnits("100000", DECIMALS);

    let tx;
    let balance;

    async function dep() {
        const[deployer] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("UniswapFlashSwap");
        const Contract = await Factory.deploy();
        await Contract.deployed();

        return {Contract, deployer}
    }

    it('it works', async function() {
        const{Contract, deployer} = await loadFixture(dep);
        const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_WHALE);
        // await impersonatedSigner.sendTransaction(...);
        const contractUSDC = new ethers.Contract(USDC, erc20abi, deployer);

        //send 1eth to usdc whale in case he cannot pay the fees
        const txData = {
            value: ethers.utils.parseEther('1'),
            to: USDC_WHALE
        }
        tx = await deployer.sendTransaction(txData);
        await tx.wait();

        //send USDC from whale to deployer
        tx = await contractUSDC.connect(impersonatedSigner).transfer(deployer.address, FUND_AMOUNT);
        await tx.wait();
        //console.log(tx);
        balance = await contractUSDC.balanceOf(deployer.address);
        console.log('USDC deployer: '+ethers.utils.formatUnits ( balance, DECIMALS));
        
        tx = await contractUSDC.connect(deployer).transfer(Contract.address, FUND_AMOUNT);
        
        balance = await contractUSDC.balanceOf(Contract.address);
        console.log('USDC UniswapFlashSwap: '+ethers.utils.formatUnits ( balance, DECIMALS));
        



        tx = await Contract.connect(deployer).testFlashSwap(TOKEN_BORROW, BORROW_AMOUNT);
        await tx.wait();


        const filter = Contract.filters.Log();
        
        const events = await Contract.queryFilter(filter, -5);
        for (let index = 0; index < events.length; index++) {
            console.log(
                events[index].args.message+
                " : "+
                ethers.utils.formatUnits(events[index].args.val, DECIMALS)
            );
        }
    });
});