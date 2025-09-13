/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAGIX_TESTNET_CONTRACT_ADDRESS: string;
  readonly VITE_MAGIX_MAINNET_CONTRACT_ADDRESS: string;
  readonly VITE_WC_PROJECT_ID: string;
  readonly VITE_PINATA_JWT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
