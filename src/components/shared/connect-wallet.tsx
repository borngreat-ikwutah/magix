"use client";

import { useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Wallet, Copy, Check, ExternalLink, LogOut, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { cn, formatAddress } from "~/lib/utils";
import { evmWalletConfig } from "~/lib/utils.tsx";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

// EVM wallet configurations with proper icons and colors

export function ConnectWallet(props: Props) {
  const [copied, setCopied] = useState(false);
  const { connectors, connect, status, error } = useConnect();
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      props.setIsOpen(false);
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Filter for EVM-compatible wallets only and sort MetaMask first
  const evmConnectors = connectors
    .filter((connector) => {
      // Only show EVM-compatible wallets
      const supportedEvmWallets = Object.keys(evmWalletConfig);
      return supportedEvmWallets.includes(connector.name);
    })
    .sort((a, b) => {
      // MetaMask first (recommended)
      if (a.name === "MetaMask") return -1;
      if (b.name === "MetaMask") return 1;
      return 0;
    })
    .slice(0, 2); // Show max 2 connectors as requested

  if (isConnected) {
    return (
      <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connected
            </DialogTitle>
            <DialogDescription>
              Your wallet is successfully connected to the application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Address
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="h-auto p-1"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-sm bg-muted p-3 rounded-md break-all">
                    {address}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Network
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">{chain?.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() =>
                  window.open(
                    `${chain?.blockExplorers?.default.url}/address/${address}`,
                    "_blank",
                  )
                }
              >
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => {
                  disconnect();
                  props.setIsOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="sm:max-w-md bg-dark-10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Choose an EVM-compatible wallet to connect to this application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {evmConnectors.map((connector) => {
            const config =
              evmWalletConfig[connector.name as keyof typeof evmWalletConfig];
            if (!config) return null;

            return (
              <Button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={status === "pending"}
                variant="outline"
                className={cn(
                  "w-full justify-start gap-3 h-16 text-left relative hover:!bg-dark-10 hover:text-white",
                  status === "pending" && "opacity-50",
                  config.recommended && "ring-2 ring-primary/20 bg-primary/5",
                )}
              >
                {config.recommended && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Recommended
                  </div>
                )}

                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    config.bgColor,
                  )}
                >
                  {config.icon}
                </div>

                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {connector.name}
                    {config.recommended && (
                      <Star className="h-4 w-4 text-primary fill-current" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>

                {status === "pending" && (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </Button>
            );
          })}
        </div>

        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                  <span className="text-destructive text-xs">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-destructive mb-1">
                    Connection Failed
                  </h4>
                  <p className="text-sm text-destructive/80">{error.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground text-center pt-2">
          By connecting your wallet, you agree to our Terms of Service and
          Privacy Policy.
        </div>
      </DialogContent>
    </Dialog>
  );
}
