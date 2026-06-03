import { coinbaseWallet, injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

// Replace with the ERC-8021 encoded builder code after base.dev verification.
export const builderCodeDataSuffix = '0x' as `0x${string}`;

export const chains = [base, baseSepolia] as const;

export const wagmiConfig = createConfig({
  chains,
  ssr: true,
  multiInjectedProviderDiscovery: true,
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'TrustDrop',
      preference: 'all'
    })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  }
});
