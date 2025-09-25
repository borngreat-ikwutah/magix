import { MetaMaskIcon } from "~/assets/icons";
import { type WalletConfig } from "./utils";
import { Home, PlusCircle, Search, Settings } from "lucide-react";

export const evmWalletConfig: Record<string, WalletConfig> = {
  MetaMask: {
    icon: <MetaMaskIcon />,
    bgColor: "bg-orange-500/10",
    description: "Most popular Ethereum wallet",
    recommended: true,
  },
};

// Minimal navigation items
export const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/app/home",
  },
  {
    title: "Browse Campaigns",
    icon: Search,
    url: "/campaigns",
  },
  {
    title: "Create Campaign",
    icon: PlusCircle,
    url: "/create-campaigns",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/app/settings",
  },
];
