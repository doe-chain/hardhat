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
describe("Minimal test", function() {
    async function dep() {
        const[deployer] = await ethers.getSigners();

        const LogicFactory = await ethers.getContractFactory("Logic");
        const LogicContract = await LogicFactory.deploy();
        await LogicContract.deployed();

        const ProxyFactory = await ethers.getContractFactory("MinimalProxyDeployer");
        const ProxyDeployerContract = await ProxyFactory.deploy();
        await ProxyDeployerContract.deployed();        

        return {LogicContract, ProxyDeployerContract,  deployer}
    }

    it('it works', async function() {
        const{LogicContract, ProxyDeployerContract, deployer} = await loadFixture(dep);

        const proxy1DeployTx = await ProxyDeployerContract.connect(deployer).clone(LogicContract.address);
        await proxy1DeployTx.wait();

        const contractProxyDeployer = new ethers.Contract(
            ProxyDeployerContract.address,
            ['function newProxyAddress() public view returns(address)'],
            deployer
        );
        const proxy1Address = await contractProxyDeployer.newProxyAddress();

        const logicAbi = [
            'function x() public view returns(uint)',
            'function plus() external'
        
        ];

        const contractProxy1 = new ethers.Contract(proxy1Address, logicAbi, deployer);

        const proxy1Tx = await contractProxy1.connect(deployer).plus();
        await proxy1Tx.wait();
        const proxy1Tx2 = await contractProxy1.connect(deployer).plus();
        await proxy1Tx2.wait();        

        expect(await contractProxy1.x()).to.eq(2)
        // console.log(await contractProxy1.x());

        // console.log(proxy1Address);

        const proxy2DeployTx = await ProxyDeployerContract.connect(deployer).clone(LogicContract.address);
        await proxy2DeployTx.wait();

        const proxy2Address = await contractProxyDeployer.newProxyAddress();
        
        // console.log(proxy2Address);

        const contractProxy2 = new ethers.Contract(proxy2Address, logicAbi, deployer);

        const proxy2Tx = await contractProxy2.connect(deployer).plus();
        await proxy2Tx.wait();

        
        expect(await contractProxy2.x()).to.eq(1)
        // console.log(await contractProxy2.x());

        // console.log(proxy2Address);













        //console.log(proxy1DeployTx);
        // const mintTx = await token.safeMint(deployer.address, "https://site.eth");
        // await mintTx.wait();
        
        // expect(await token.balanceOf(deployer.address)).to.eq(1);


        // const NFTFactoryV2 = await ethers.getContractFactory("MyTokenV2");
        // const token2 = await upgrades.upgradeProxy(token.address, NFTFactoryV2);
        
        // expect(await token2.balanceOf(deployer.address)).to.eq(1);

        // expect(await token2.test()).to.be.true;

    });
});