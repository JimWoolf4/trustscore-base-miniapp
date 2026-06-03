# TrustDrop

TrustDrop is a Base miniapp with a warm, mobile-first reward flow. Users do not need to buy a token to participate: the first wallet interaction unlocks an instant visible starter reward, and optional onchain trust rewards can be sent through Wagmi and Viem.

## Stack

- Next.js App Router
- TypeScript
- Wagmi native config
- Viem
- Tailwind CSS
- Hardhat contract tooling

## Wallets

The app does not use RainbowKit, WalletConnect, or `getDefaultConfig`.

Wallet connection is configured in `lib/wagmi.ts` with:

- `injected()` for Base App embedded wallet, MetaMask, OKX, and other injected wallets
- `coinbaseWallet()` for Coinbase Wallet

## Base Attribution

Offchain attribution:

- Set the verified Base App token in `app/layout.tsx`
- The tag is hardcoded directly in `<head>`:

```tsx
<meta name="base:app_id" content="" />
```

Onchain attribution:

- Set the ERC-8021 builder code in `lib/wagmi.ts`

```ts
export const builderCodeDataSuffix = '0x' as `0x${string}`;
```

- Every `writeContract` call must pass:

```ts
dataSuffix: builderCodeDataSuffix
```

## Environment

```bash
cp .env.example .env.local
```

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContract
NEXT_PUBLIC_CHAIN_ID=84532
```

Use `84532` for Base Sepolia and `8453` for Base mainnet.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Contract Deployment

```bash
npm run compile
npm run deploy:base-sepolia
```

After deployment, set `NEXT_PUBLIC_CONTRACT_ADDRESS` and redeploy the frontend.
