<div align="center">
  <h1>🪄 Magix</h1>
  <p><em>Decentralized Crowdfunding on Flow Blockchain</em></p>

  <p>
    <a href="#overview">Overview</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Flow-00EF8B?style=for-the-badge&logo=flow&logoColor=white" alt="Flow" />
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </p>
</div>

---

## 🌊 Overview

**Magix** is a next-generation decentralized crowdfunding platform built on the **Flow blockchain**, leveraging Flow EVM's Solidity compatibility to provide seamless, transparent, and secure fundraising experiences. Our platform enables individuals and organizations to create funding campaigns with smart contract-backed escrow systems, ensuring contributors' funds are safely managed until campaign goals are met.

### Why Flow Blockchain?

Flow blockchain offers unique advantages for crowdfunding platforms:

- **⚡ High Performance**: 10,000+ TPS with sub-second finality
- **💰 Low Costs**: Minimal transaction fees for global accessibility
- **🌱 Eco-Friendly**: Proof-of-Stake consensus with minimal energy consumption
- **🔗 EVM Compatibility**: Seamless Solidity smart contract deployment via Flow EVM
- **👥 User-Friendly**: Built for mainstream adoption with intuitive wallet experiences
- **🔒 Enterprise Security**: Battle-tested architecture with multi-role security model

## ✨ Features

### 🔐 Smart Contract Security
- **Automated Escrow**: Solidity-based contracts automatically lock and release funds
- **Time & Goal-Based Triggers**: Flexible release conditions with optional refund mechanisms
- **Transparent Auditing**: All transactions immutably recorded on Flow's blockchain

### 🚀 Frictionless Experience
- **No Registration Required**: Contribute directly from any EVM-compatible wallet
- **One-Click Donations**: MetaMask, Flow Wallet, or any Web3 wallet support
- **Cross-Border Payments**: Global accessibility with FLOW tokens and stablecoins

### 🎯 Advanced Campaign Features
- **Campaign Tokens**: ERC-20/721 compatible tokens for contributor rewards
- **Milestone Tracking**: Real-time progress monitoring with transparent reporting
- **Multi-Currency Support**: FLOW, USDC, and other supported tokens
- **Creator Verification**: Optional identity verification for enhanced trust

### 🎨 Modern Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: Customizable themes with system preference detection
- **Real-Time Updates**: Live campaign data with automatic refresh
- **Intuitive Navigation**: Built with React Router and TanStack Query

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for lightning-fast development
- **Routing**: TanStack Router with type-safe navigation
- **Styling**: TailwindCSS with Radix UI components
- **State Management**: TanStack Query for server state
- **Web3 Integration**: Wagmi + Viem for wallet connections

### Blockchain
- **Network**: Flow Blockchain (Mainnet & Testnet)
- **Smart Contracts**: Solidity via Flow EVM
- **Wallet Support**: Flow FCL SDK + EVM-compatible wallets
- **Token Standards**: ERC-20/721 compatibility on Flow EVM

### Development Tools
- **Language**: TypeScript for type safety
- **Package Manager**: Bun for fast installs
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest for unit testing
- **Deployment**: Vercel/Netlify ready

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Flow CLI** for blockchain interactions
- **MetaMask** or Flow Wallet for testing
- **Git** for version control

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/magix.git
cd magix
