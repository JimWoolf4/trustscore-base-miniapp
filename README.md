# TrustScoreBaseMiniapp

Repository: https://github.com/JimWoolf4/trustscore-base-miniapp.git

## Overview

TrustScoreBaseMiniapp is a lightweight Base miniapp for social reputation, onchain credibility, and wallet identity scoring.

The app allows users to assign trust points to wallet addresses.

These trust interactions can create onchain records that represent credibility, contribution, and community recognition.

The project is designed to provide a clear trust signal through wallet interaction, with optional onchain scoring supported by Wagmi and Viem.

## Features

- Social reputation scoring for wallet addresses
- Onchain trust point interactions
- Wallet identity and credibility display
- Base miniapp compatibility
- Native Wagmi configuration
- Viem-based contract interaction support
- Tailwind CSS styling
- Hardhat tooling for contract compilation and deployment

## Tech Stack

- Next.js App Router
- TypeScript
- Wagmi native configuration
- Viem
- Tailwind CSS
- Hardhat contract tooling

## Miniapp Category

TrustScoreBaseMiniapp is designed for:

- Social reputation
- Onchain reputation
- Identity scoring
- Onchain reputation score contracts

## Wallet Support

This project does not use RainbowKit, WalletConnect, or `getDefaultConfig`.

Wallet connection is configured directly in:

```ts
lib/wagmi.ts
```

Supported connection options include:

- `injected()` for the Base App embedded wallet, MetaMask, OKX, and other injected wallets
- `coinbaseWallet()` for Coinbase Wallet

## Base App Attribution

Offchain attribution is configured in:
