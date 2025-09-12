import { Address } from "viem";
// import { flowTestnet } from 'wagmi/chains';
import { magixCrowdfundingAbi } from "../generated";

// Define contract configuration type
export interface ContractConfig {
  address: Address;
  abi: typeof magixCrowdfundingAbi;
  chainId: number;
  networkName: string;
}

// Get current environment contract config
export function getContractConfig(): ContractConfig {
  const isProduction = import.meta.env.MODE === "production";

  const address = isProduction
    ? import.meta.env.VITE_MAGIX_MAINNET_CONTRACT_ADDRESS
    : import.meta.env.VITE_MAGIX_TESTNET_CONTRACT_ADDRESS;

  if (!address) {
    throw new Error(
      `Contract address not configured for ${isProduction ? "production" : "development"} environment`,
    );
  }

  return {
    address: address as Address,
    abi: magixCrowdfundingAbi,
    chainId: isProduction ? 747 : 545, // Flow Mainnet : Flow Testnet
    networkName: isProduction ? "Flow Mainnet" : "Flow Testnet",
  };
}

// Export the contract config
export const CONTRACT_CONFIG = getContractConfig();

// Export individual values for convenience
export const MAGIX_CONTRACT_ADDRESS = CONTRACT_CONFIG.address;
export const MAGIX_CONTRACT_ABI = CONTRACT_CONFIG.abi;
