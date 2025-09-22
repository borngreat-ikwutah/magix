import React from "react";

export const MetaMaskIcon = ({ className }: { className?: string }) => (
  <img src="/icons/metamask-icon.svg" alt="MetaMask" className={className} />
);

export const WalletConnectIcon = ({ className }: { className?: string }) => (
  <img
    src="/icons/walletconnect.png"
    alt="WalletConnect"
    className={className}
  />
);

export const CoinbaseIcon = ({ className }: { className?: string }) => (
  <img src="/icons/coinbase.svg" alt="Coinbase Wallet" className={className} />
);

export const TrustWalletIcon = ({ className }: { className?: string }) => (
  <img src="/icons/trustwallet.png" alt="Trust Wallet" className={className} />
);
