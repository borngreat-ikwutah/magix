import { MetaMaskIcon } from "~/assets/icons";
import { type WalletConfig } from "./utils";

export const evmWalletConfig: Record<string, WalletConfig> = {
  MetaMask: {
    icon: <MetaMaskIcon />,
    bgColor: "bg-orange-500/10",
    description: "Most popular Ethereum wallet",
    recommended: true,
  },
};
