import { isAddress } from 'viem';

export function shortAddress(address?: string) {
  if (!address) return 'Not connected';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isValidWalletAddress(value: string) {
  return isAddress(value.trim());
}

export function formatError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/user rejected|rejected request|denied/i.test(message)) {
    return 'Request rejected in wallet.';
  }
  if (/AlreadyTrusted/i.test(message)) return 'You already trusted this address.';
  if (/CannotTrustSelf/i.test(message)) return 'You cannot reward yourself.';
  if (/ZeroAddress/i.test(message)) return 'Zero address is not allowed.';
  if (/insufficient funds/i.test(message)) return 'Insufficient funds for gas.';

  return 'Transaction failed. Please review your wallet and try again.';
}
