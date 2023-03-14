require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { INFURA_API_KEY, MNEMONIC } = process.env;

module.exports = {
  contracts_build_directory: "../client/src/contracts",
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider("a9b2c8c41901ffef026a54a1bcf528a580352421304e8a46726924de35c4519a", INFURA_API_KEY),
      network_id: 11155111,
    },
  },
  compilers: {
    solc: {
      version: "0.8.18",
    }
  },
};
