import type { Address } from 'viem';
import { zeroAddress } from 'viem';

export const trustScoreAbi = [
  {
    type: 'function',
    name: 'giveTrust',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'getTrustScore',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getGivenTrustCount',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'hasUserTrusted',
    stateMutability: 'view',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    type: 'function',
    name: 'getTrustedUsers',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }]
  },
  {
    type: 'event',
    name: 'TrustGiven',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'newScore', type: 'uint256', indexed: false }
    ]
  }
] as const;

export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || zeroAddress) as Address;
export const configuredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 84532);
export const hasContractAddress = contractAddress !== zeroAddress;
