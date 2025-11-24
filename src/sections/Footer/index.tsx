import { FooterContent } from "@/sections/Footer/components/FooterContent";
import { FooterCopyright } from "@/sections/Footer/components/FooterCopyright";

export const Footer = () => {
  return (
    <div className="text-stone-200 bg-neutral-950 box-border caret-transparent w-full z-0 pt-12 pb-20">
      <FooterContent />
      <FooterCopyright />
    </div>
  );
};
