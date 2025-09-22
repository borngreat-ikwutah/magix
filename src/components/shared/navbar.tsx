import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ConnectWallet } from "./connect-wallet";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-dark-10 w-full border-b-grey-08 border-b py-4 px-6 max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/magix-icon.svg" alt="Magix" className="size-6" />
          <h1 className="text-white text-xl font-bold">Magix</h1>
        </div>

        <div className="relative w-[30%] max-lg:hidden">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
          <Input
            className="pl-8 border-b-grey-08 "
            placeholder="Search for Projects"
          />
        </div>
        <Button
          className="bg-yellow-55 text-black hover:bg-yellow-55 hover:text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          Connect Wallet
        </Button>
      </nav>

      <ConnectWallet isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)} />
    </>
  );
};
