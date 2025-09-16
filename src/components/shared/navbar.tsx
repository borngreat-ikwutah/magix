import { useState } from "react";
import { MobileNav } from "./mobile-nav";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full"></div>

      <MobileNav isOpen={isOpen} onOpenChange={() => setIsOpen(!isOpen)} />
    </>
  );
};
