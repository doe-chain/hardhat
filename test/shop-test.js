const {expect} = require("chai")
const{ethers} = require("hardhat")
const tokenJSON = require("../artifacts/contracts/Token.sol/Shop.json")

describe("Shop", function() {
    let owner
    let buyer
    let Shop
    let erc20

    
    
    beforeEach(async function() {
        [owner, buyer] = await ethers.getSigners()

        const Shop = await ethers.getContractFactory("Shop", owner)

        shop = await Shop.deploy()

        await shop.deployed()

        erc20 = new ethers.Contract(await shop.token(), tokenJSON.abi, owner)
    })

    it("have owner and token", async function() {
        expect(await shop.owner.to.eq(owner.address))

        expect(await shop.token()).to.be.properAddress
    })

    it("allow to buy", async function() {
        const tokenAmount = 100
        const txData = {
            value: tokenAmount,
            to: shop.address
        }

        const tx = await buyer.sendTransaction(txData)
        await tx.wait()
        
        expect(await erc20.balanceOf(buyer.address)).to.eq.apply(tokenAmount)

        await expect(() => tx).to.changeEtherBalance(shop, tokenAmount)

        await expect(tx).to.emit(shop, "Bought").withArgs(tokenAmount, buyer.address)
    })

    it("allow to buy", async function() {
        const tx = await buyer.sendTransaction({
            value:10,
            to: Shop.address
        })
        await tx.wait()

        const sellAmount = 6

        const approval = await erc20.connect(buyer).approve(Shop.address, sellAmount)

        await approval.wait()

        const sellTx = await shop.connect(buyer).sell(sellAmount)
        expect(await erc20.balanceOf(buyer.address)).to.eq(4)

        await expect(() => sellTx).to.changeEtherBalance(shop, -sellAmount)

        await expect(tx).to.emit(shop, "Sold").withArgs(sellAmount, buyer.address)

    })


})