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

```ts
app/layout.tsx
```

After verification on base.dev, set the verified Base App identifier in the `<head>` metadata:

```tsx
<meta name="base:app_id" content="" />
```

Onchain attribution is configured in:

```ts
lib/wagmi.ts
```

The Wagmi configuration includes a hardcoded `dataSuffix` field for the ERC-8021 builder code:

```ts
export const builderCodeDataSuffix = '0x' as `0x${string}`;
```

Each relevant `writeContract` call should include the configured suffix:

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

Use the following chain IDs:

- `84532` for Base Sepolia
- `8453` for Base mainnet

The configured TrustScore contract address is intended for deployment on Base mainnet.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local app in your browser using the URL printed by Next.js.

## Production Build

Create a production build:

```bash
npm run build
```

## Contract Compilation

Compile the smart contract with Hardhat:

```bash
npm run compile
```

## Contract Deployment

Deploy to Base Sepolia:

```bash
npm run deploy:base-sepolia
```

After deployment, update the contract address in:

```bash
.env.local
```

Set the deployed contract address:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContract
```

Then rebuild and redeploy the frontend so the app points to the latest contract.

## Usage Notes

- Keep wallet configuration centralized in `lib/wagmi.ts`.
- Keep Base App metadata in `app/layout.tsx`.
- Keep contract address and chain ID values in environment variables.
- Ensure every relevant contract write includes `dataSuffix`.
- Confirm that the selected chain ID matches the deployed contract network.
- Redeploy the frontend after changing public environment variables.

## Suggested Workflow

1. Install dependencies.
2. Create `.env.local` from `.env.example`.
3. Set the contract address and chain ID.
4. Run the app locally.
5. Compile the contract if changes are made.
6. Deploy the contract to the intended Base network.
7. Update the frontend environment values.
8. Build and redeploy the frontend.

## Project Structure Notes

Key project files include:

- `app/layout.tsx` for app-level metadata
- `lib/wagmi.ts` for wallet and chain configuration
- Hardhat configuration for contract compilation and deployment
- Environment variables for public contract configuration

## Maintenance Notes

When updating the project, keep configuration changes explicit and easy to review.

Avoid duplicating wallet or chain settings across multiple files.

Check environment values carefully before deploying to a production network.

Keep the frontend and deployed contract address in sync after every contract deployment.
