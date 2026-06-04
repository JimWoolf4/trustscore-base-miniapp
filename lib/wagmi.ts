import { coinbaseWallet, injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

export const builderCode = 'bc_dr32h1ub';
export const builderCodeDataSuffix = '0x62635f64723332683175620b0080218021802180218021802180218021' as `0x${string}`;

export const chains = [base, baseSepolia] as const;

export const wagmiConfig = createConfig({
  chains,
  ssr: true,
  dataSuffix: builderCodeDataSuffix,
  multiInjectedProviderDiscovery: true,
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'TrustScore',
      preference: 'all'
    })
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  }
} as Parameters<typeof createConfig>[0] & { dataSuffix: `0x${string}` });
