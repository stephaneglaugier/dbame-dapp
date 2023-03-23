require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { INFURA_API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  contracts_build_directory: "../client/src/contracts",
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, INFURA_API_KEY),
      network_id: 11155111,
    },
  },
  compilers: {
    solc: {
      version: "0.8.18",
    }
  },
};
