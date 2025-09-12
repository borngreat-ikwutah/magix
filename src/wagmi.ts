import { createConfig, http } from "wagmi";
import { mainnet, sepolia, flowTestnet } from "wagmi/chains";
import { baseAccount, injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [flowTestnet],
  connectors: [
    injected(),
    baseAccount(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [flowTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
