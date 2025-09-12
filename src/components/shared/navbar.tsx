import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleSidebar(value: boolean) {
    setIsOpen(!value);
  }

  return (
    <div className="w-full max-sm:max-w-screen-sm">
      {/*SIDE BAR*/}
      <div onClick={() => toggleSidebar(isOpen)}></div>
    </div>
  );
};
