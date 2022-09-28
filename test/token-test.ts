import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";


describe("Proxy token", function() {
    async function dep() {
        const[deployer] = await ethers.getSigners();

        const NFTFactory = await ethers.getContractFactory("MyToken");

        const token = await upgrades.deployProxy(NFTFactory, [], {
            initializer: 'initialize',
        });
        await token.deployed();

        return {token, deployer}
    }

    it('it works', async function() {
        const{token, deployer} = await loadFixture(dep);

        const mintTx = await token.safeMint(deployer.address, "https://site.eth");
        await mintTx.wait();

        expect(token.balanceOf(deployer.address)).to.eq(1);
    });
});