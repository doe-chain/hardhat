import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";


//deploy logic
//deploy proxyDeployer
//deploy proxy1
//call proxy1->plus plus
//deploy proxy2
//call proxy2->plus
//proxy1==2 proxy2==1
describe("UniswapV2 swap test", function() {
    async function dep() {
        const[deployer] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("UniswapV2Swap");
        const Contract = await Factory.deploy();
        await Contract.deployed();



        return {Contract, deployer}
    }

    it('it works', async function() {
        const{Contract, deployer} = await loadFixture(dep);
        console.log(Contract);
        console.log(1);
        expect(2).to.equal(2);
    });
});