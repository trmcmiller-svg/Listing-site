import { NavbarLogo } from "@/sections/Header/components/NavbarLogo";
import { DesktopSearch } from "@/sections/Header/components/DesktopSearch";
import { DesktopNav } from "@/sections/Header/components/DesktopNav";

export const Navbar = () => {
  return (
    <div className="items-center self-center box-border caret-transparent flex justify-between w-full mx-auto">
      <NavbarLogo />
      <DesktopSearch />
      <DesktopNav />
    </div>
  );
};
