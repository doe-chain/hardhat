import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;

    const { deploy, get } = deployments;

    const { deployer } = await getNamedAccounts();

    const token = await get("Token");

    await deploy("Governance", {
    from: deployer,
    args: [token.address],
    log: true
    });
}

export default func;
func.tags = ['Governance'];