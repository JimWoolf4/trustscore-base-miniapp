# TrustScoreBaseMiniapp

Repository: https://github.com/JimWoolf4/trustscore-base-miniapp.git

## Overview

TrustScoreBaseMiniapp is a lightweight Base miniapp for social reputation, onchain credibility, and wallet identity scoring.

The app lets users assign trust points to other wallet addresses. These interactions create onchain records that can represent credibility, contribution, and community recognition.

The project is designed to provide an immediate visible trust signal through wallet interaction, with optional onchain trust scoring handled through Wagmi and Viem.

## Features

- Social reputation scoring for wallet addresses
- Onchain trust point interactions
- Wallet identity and credibility display
- Base miniapp compatibility
- Native Wagmi configuration
- Viem-based contract interaction support
- Tailwind CSS styling
- Hardhat tooling for contract compilation and deployment

## Stack

- Next.js App Router
- TypeScript
- Wagmi native config
- Viem
- Tailwind CSS
- Hardhat contract tooling

## Miniapp Type

- Social reputation
- Onchain reputation
- Identity scoring
- Contract category: onchain reputation score contract

## Wallet Support

The app does not use RainbowKit, WalletConnect, or `getDefaultConfig`.

Wallet connection is configured in `lib/wagmi.ts`.

Supported connection options include:

- `injected()` for the Base App embedded wallet, MetaMask, OKX, and other injected wallets
- `coinbaseWallet()` for Coinbase Wallet

## Base App Attribution

Offchain attribution is configured in `app/layout.tsx`.

After verification on base.dev, set the verified Base App identifier in the `<head>` metadata:

```tsx
<meta name="base:app_id" content="" />
```

Onchain attribution is configured in `lib/wagmi.ts`.

The Wagmi config includes a hardcoded `dataSuffix` field for the ERC-8021 builder code:

```ts
export const builderCodeDataSuffix = '0x' as `0x${string}`;
```

Every `writeContract` call should include the configured suffix:

```ts
dataSuffix: builderCodeDataSuffix
```

## Environment Setup

Create a local environment file from the example file:

```bash
cp .env.example .env.local
```

Set the contract address and chain ID:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContract
NEXT_PUBLIC_CHAIN_ID=84532
```

Use `84532` for Base Sepolia.

Use `8453` for Base mainnet.

The configured TrustScore contract address is intended for deployment on Base mainnet.

## Local Development
