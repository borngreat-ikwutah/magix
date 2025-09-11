require("@nomicfoundation/hardhat-toolbox");

require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const flowWalletPrivateKey = process.env.FLOW_WALLET_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    flow: {
      url: "https://mainnet.evm.nodes.onflow.org",
      accounts: [flowWalletPrivateKey],
    },
    flowTestnet: {
      url: "https://testnet.evm.nodes.onflow.org",
      accounts: [flowWalletPrivateKey],
    },
  },
};
