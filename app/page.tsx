'use client';

import {
  Award,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Gift,
  HeartHandshake,
  Loader2,
  LogOut,
  ShieldCheck,
  Sparkles,
  Wallet
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Address } from 'viem';
import { zeroAddress } from 'viem';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

import { configuredChainId, contractAddress, hasContractAddress, trustScoreAbi } from '@/lib/contract';
import { formatError, isValidWalletAddress, shortAddress } from '@/lib/utils';
import { builderCodeDataSuffix } from '@/lib/wagmi';

const supportedChains = [base, baseSepolia];

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: configuredChainId
  });

  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [targetAddress, setTargetAddress] = useState('');
  const [status, setStatus] = useState('');
  const [claimed, setClaimed] = useState(false);

  const expectedChain = supportedChains.find((chain) => chain.id === configuredChainId) || baseSepolia;
  const wrongNetwork = isConnected && chainId !== configuredChainId;
  const parsedTarget = targetAddress.trim() as Address;
  const validTarget = isValidWalletAddress(targetAddress);
  const isSelfReward = Boolean(address && validTarget && parsedTarget.toLowerCase() === address.toLowerCase());

  const contractBase = {
    address: contractAddress,
    abi: trustScoreAbi,
    chainId: configuredChainId
  } as const;

  const { data: myScore, refetch: refetchMyScore } = useReadContract({
    ...contractBase,
    functionName: 'getTrustScore',
    args: [address || zeroAddress],
    query: { enabled: hasContractAddress && isConnected }
  });

  const { data: myGivenCount, refetch: refetchMyGiven } = useReadContract({
    ...contractBase,
    functionName: 'getGivenTrustCount',
    args: [address || zeroAddress],
    query: { enabled: hasContractAddress && isConnected }
  });

  const { data: targetAlreadyTrusted, refetch: refetchTargetTrusted } = useReadContract({
    ...contractBase,
    functionName: 'hasUserTrusted',
    args: [address || zeroAddress, validTarget ? parsedTarget : zeroAddress],
    query: { enabled: hasContractAddress && isConnected && validTarget }
  });

  const { data: targetScore, refetch: refetchTargetScore } = useReadContract({
    ...contractBase,
    functionName: 'getTrustScore',
    args: [validTarget ? parsedTarget : zeroAddress],
    query: { enabled: hasContractAddress && validTarget }
  });

  const { data: targetGivenCount } = useReadContract({
    ...contractBase,
    functionName: 'getGivenTrustCount',
    args: [validTarget ? parsedTarget : zeroAddress],
    query: { enabled: hasContractAddress && validTarget }
  });

  const injectedConnector = useMemo(
    () => connectors.find((item) => item.type === 'injected') || connectors[0],
    [connectors]
  );
  useEffect(() => {
    setClaimed(window.localStorage.getItem('trustscore:starter-signal') === 'claimed');
  }, []);

  useEffect(() => {
    if (writeError) setStatus(formatError(writeError));
  }, [writeError]);

  useEffect(() => {
    if (!isSuccess) return;
    setStatus('Onchain trust reward confirmed.');
    setTargetAddress('');
    refetchMyScore();
    refetchMyGiven();
    refetchTargetTrusted();
    refetchTargetScore();
  }, [isSuccess, refetchMyGiven, refetchMyScore, refetchTargetScore, refetchTargetTrusted]);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isBaseApp = userAgent.includes('base') && Boolean(window.ethereum);
    if (!isBaseApp || isConnected || !injectedConnector) return;
    connect({ connector: injectedConnector });
  }, [connect, injectedConnector, isConnected]);

  const starterReward = claimed ? 120 : isConnected ? 100 : 0;
  const totalSignal = starterReward + Number(myScore || 0n) * 25 + Number(myGivenCount || 0n) * 10;
  const primaryLabel = isConnected ? (claimed ? 'Trust Signal Claimed' : 'Reveal Trust Signal') : 'Connect Wallet';

  function handlePrimaryAction() {
    if (!isConnected) {
      setWalletMenuOpen(true);
      return;
    }

    window.localStorage.setItem('trustscore:starter-signal', 'claimed');
    setClaimed(true);
    setStatus('Starter trust signal unlocked instantly.');
  }

  function handleTrustReward() {
    setStatus('');
    reset();

    if (!isConnected) {
      setWalletMenuOpen(true);
      return;
    }
    if (wrongNetwork) {
      switchChain({ chainId: configuredChainId });
      return;
    }
    if (!hasContractAddress) {
      setStatus('Contract address is not configured yet.');
      return;
    }
    if (!validTarget) {
      setStatus('Enter a valid wallet address.');
      return;
    }
    if (isSelfReward) {
      setStatus('Choose another wallet to reward.');
      return;
    }
    if (targetAlreadyTrusted) {
      setStatus('You already rewarded this wallet.');
      return;
    }

    writeContract({
      ...contractBase,
      functionName: 'giveTrust',
      args: [parsedTarget],
      dataSuffix: builderCodeDataSuffix
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cocoa text-white">
            <Gift size={21} />
          </div>
          <div>
            <p className="text-lg font-black leading-tight">TrustScore</p>
            <p className="text-xs font-semibold text-stone-500">Onchain reputation on Base</p>
          </div>
        </div>

        <div className="relative">
          <button className="secondary-button" onClick={() => setWalletMenuOpen((open) => !open)}>
            <Wallet size={16} />
            <span className="hidden sm:inline">{isConnected ? shortAddress(address) : 'Connect'}</span>
            <ChevronDown size={15} />
          </button>
          {walletMenuOpen && (
            <WalletMenu
              connectors={connectors}
              isConnected={isConnected}
              isConnecting={isConnecting}
              connectedName={connector?.name}
              onClose={() => setWalletMenuOpen(false)}
              onConnect={(selected) => {
                connect({ connector: selected });
                setWalletMenuOpen(false);
              }}
              onDisconnect={() => {
                disconnect();
                setWalletMenuOpen(false);
              }}
            />
          )}
        </div>
      </header>

      <section className="grid flex-1 gap-5 py-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white/80 px-3 py-2 text-sm font-bold text-ember">
            <Sparkles size={16} />
            Social reputation / Onchain identity score
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black leading-[1.04] text-cocoa sm:text-5xl lg:text-6xl">TrustScore</h1>
            <p className="max-w-2xl text-xl font-bold leading-8 text-stone-700 sm:text-2xl">
              Show wallet credibility through lightweight Base trust records.
            </p>
            <p className="max-w-xl text-base leading-7 text-stone-600">
              Give trust points to wallets that contribute, help, or earn community recognition. Your first interaction
              reveals a visible reputation signal without buying any token.
            </p>
          </div>

          <button className="primary-button" disabled={claimed && isConnected} onClick={handlePrimaryAction}>
            <Gift size={18} />
            {primaryLabel}
          </button>

          <div className="grid grid-cols-3 gap-2 sm:max-w-xl">
            <MiniStat label="Signal" value={`${starterReward}`} />
            <MiniStat label="Trust" value={`${myScore || 0n}`} />
            <MiniStat label="Score" value={`${totalSignal}`} />
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label">Identity Score</p>
              <p className="mt-2 text-5xl font-black text-cocoa">{totalSignal}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-orange-100 text-ember">
              <Award size={30} />
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-cream p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-cocoa">Starter trust signal</span>
              <span className="rounded-lg bg-white px-3 py-1 text-sm font-black text-mint">
                {claimed ? 'Unlocked' : 'Ready'}
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-orange-100">
              <div className="h-full rounded-full bg-ember transition-all" style={{ width: claimed ? '100%' : isConnected ? '70%' : '20%' }} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoTile icon={<Wallet size={18} />} label="Wallet" value={isConnected ? shortAddress(address) : 'Not connected'} />
            <InfoTile icon={<CheckCircle2 size={18} />} label="Network" value={wrongNetwork ? 'Switch needed' : expectedChain.name} />
          </div>

          <div className="mt-5 border-t border-orange-100 pt-5">
            <div className="mb-3 flex items-center gap-2 text-cocoa">
              <HeartHandshake size={18} />
              <h2 className="font-black">Add Trust Score</h2>
            </div>
            <div className="space-y-3">
              <input
                className="input"
                placeholder="0x wallet address"
                value={targetAddress}
                onChange={(event) => setTargetAddress(event.target.value)}
              />
              {targetAddress && !validTarget && <p className="helper-error">Enter a valid EVM wallet address.</p>}
              {isSelfReward && <p className="helper-error">Choose another wallet to reward.</p>}
              <div className="grid grid-cols-2 gap-2">
                <InfoTile icon={<ShieldCheck size={18} />} label="Target score" value={validTarget ? `${targetScore || 0n}` : 'Enter wallet'} />
                <InfoTile icon={<HeartHandshake size={18} />} label="Target given" value={validTarget ? `${targetGivenCount || 0n}` : 'Enter wallet'} />
              </div>
              <div className="rounded-lg border border-orange-100 bg-orange-50/70 p-3 text-sm font-semibold leading-6 text-stone-700">
                This button writes to the TrustScore contract on Base. Each wallet can add one trust point to the same
                target address.
              </div>
              <button
                className="primary-button"
                disabled={isPending || isConfirming || Boolean(targetAlreadyTrusted) || Boolean(targetAddress && (!validTarget || isSelfReward))}
                onClick={handleTrustReward}
              >
                {isPending || isConfirming ? <Loader2 className="animate-spin" size={16} /> : <HeartHandshake size={16} />}
                {wrongNetwork ? `Switch to ${expectedChain.name}` : 'Add Trust +1'}
              </button>
              {targetAlreadyTrusted && <p className="helper-success">You already added trust to this wallet.</p>}
            </div>
          </div>

          {status && <p className={status.includes('confirmed') || status.includes('unlocked') ? 'helper-success' : 'helper-error'}>{status}</p>}
          {txHash && (
            <a className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-base" href={explorerTx(txHash)} target="_blank" rel="noreferrer">
              View transaction <ExternalLink size={15} />
            </a>
          )}
          {!hasContractAddress && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
              Contract address is pending. Set NEXT_PUBLIC_CONTRACT_ADDRESS before production attribution tests.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function WalletMenu({
  connectors,
  isConnected,
  isConnecting,
  connectedName,
  onConnect,
  onDisconnect,
  onClose
}: {
  connectors: ReturnType<typeof useConnect>['connectors'];
  isConnected: boolean;
  isConnecting: boolean;
  connectedName?: string;
  onConnect: (connector: ReturnType<typeof useConnect>['connectors'][number]) => void;
  onDisconnect: () => void;
  onClose: () => void;
}) {
  const visibleConnectors = connectors.filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);

  return (
    <div className="absolute right-0 top-12 z-20 w-[min(92vw,360px)] rounded-lg border border-orange-100 bg-white p-3 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-black text-cocoa">Choose wallet</p>
        <button className="text-sm font-bold text-stone-500" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="space-y-2">
        {visibleConnectors.map((item) => (
          <button className="wallet-option" disabled={isConnecting} key={item.id} onClick={() => onConnect(item)}>
            <span>
              <span className="block font-bold text-cocoa">{walletLabel(item.name)}</span>
              <span className="block text-xs font-semibold text-stone-500">{walletHint(item.name, item.type)}</span>
            </span>
            {connectedName === item.name && <CheckCircle2 className="text-mint" size={18} />}
          </button>
        ))}
        {isConnected && (
          <button className="wallet-option" onClick={onDisconnect}>
            <span className="font-bold text-red-600">Disconnect wallet</span>
            <LogOut className="text-red-600" size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function walletLabel(name: string) {
  if (/coinbase/i.test(name)) return 'Coinbase Wallet';
  if (/metaMask/i.test(name)) return 'MetaMask';
  if (/okx/i.test(name)) return 'OKX Wallet';
  if (/injected/i.test(name)) return 'Browser Wallet';
  return name;
}

function walletHint(name: string, type: string) {
  if (/coinbase/i.test(name)) return 'Coinbase app, extension, or smart wallet';
  if (/metaMask|okx/i.test(name)) return 'Uses the injected wallet provider';
  if (type === 'injected') return 'Base App, MetaMask, OKX, or another injected wallet';
  return 'Standard Wagmi wallet connector';
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3">
      <p className="text-[11px] font-bold uppercase text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-black text-cocoa">{value}</p>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-orange-100 bg-white p-4">
      <div className="flex items-center gap-2 text-ember">{icon}</div>
      <p className="mt-3 text-xs font-bold uppercase text-stone-500">{label}</p>
      <p className="mt-1 break-all text-sm font-black text-cocoa">{value}</p>
    </div>
  );
}

function explorerTx(hash: string) {
  const baseUrl = configuredChainId === 8453 ? 'https://basescan.org' : 'https://sepolia.basescan.org';
  return `${baseUrl}/tx/${hash}`;
}
