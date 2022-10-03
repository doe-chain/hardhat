import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import 'hardhat-deploy';
//import "@openzeppelin/contracts-upgradeable";
// import "@sebasgoldberg/hardhat-wsprovider";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const {
    ALCHEMY_MAINNET_URL = '',
    ALCHEMY_API_KEY = '',
    GOERLI_URL_NET = '',
    GOERLI_API_KEY = '',
    GOERLI_PRIVATE_KEY = '',
  // MAINNET_URL_NET = '',
  // MAINNET_API_KEY = '',
  // MAINNET_PRIVATE_KEY = '',
    COINMARKETCAP_API_KEY = '',
    GAS_REPORT = true,
} = process.env;

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.10",
        settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
                outputSelection: {
                    "*": {
                        "*": ["storageLayout"],
                    },
                },
        },
    },

    networks: {
        hardhat: {
            forking: {
                url: ALCHEMY_MAINNET_URL+ALCHEMY_API_KEY,
            }
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        goerli: {
            url: GOERLI_URL_NET + GOERLI_API_KEY,
            accounts: [GOERLI_PRIVATE_KEY],
        },
        // mainnet: {
        //   url: MAINNET_URL_NET + MAINNET_API_KEY,
        //   accounts: [MAINNET_PRIVATE_KEY],
        // },
    },

    // paths: {
    //     tests: TEST_GAS ? './gas' : './test',
    // },

    gasReporter: {
        enabled: GAS_REPORT ? true : false,
        showTimeSpent: true,
        showMethodSig: true,
        onlyCalledMethods: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        currency: "ETH" // currency to show
        // noColors: true, outputFile:"gas-report.txt",
        // gasPrice: 15,
        // excludeContracts: ['Migrations.sol', 'Wallets/'],
        // src: './contracts/',
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
        feeCollector:{
            default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
        }
    }

};

export default config;
