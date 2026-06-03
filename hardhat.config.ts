import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import 'dotenv/config';

const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
      chainId: 84532,
      accounts: privateKey ? [privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`] : [],
    },
    base: {
      url: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      chainId: 8453,
      accounts: privateKey ? [privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`] : [],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || '',
      base: process.env.BASESCAN_API_KEY || '',
    },
    customChains: [
      {
        network: 'baseSepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
    ],
  },
};

export default config;
