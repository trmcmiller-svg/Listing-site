import { FooterBrand } from "@/sections/Footer/components/FooterBrand";
import { FooterColumn } from "@/sections/Footer/components/FooterColumn";

export const FooterContent = () => {
  return (
    <div className="box-border caret-transparent gap-x-0 flex flex-col auto-rows-auto grid-cols-none h-full gap-y-0 mx-auto px-[22px] md:gap-x-10 md:grid md:auto-rows-max md:grid-cols-[auto_auto_auto_fit-content(100%)_fit-content(100%)_minmax(88px,max-content)] md:gap-y-10 md:px-10">
      <FooterBrand />
      <FooterColumn
        title="Company"
        variant="order-3 mb-6"
        items={[
          { text: "About", href: "https://intro.co/about", type: "link" },
          { text: "Careers", href: "https://intro.co/careers", type: "link" },
          { text: "FAQ", href: "https://intro.co/faq", type: "link" },
          {
            text: "Gift a session",
            href: "https://intro.co/giftcard",
            type: "link",
          },
          { text: "Experts", href: "https://intro.co/experts", type: "link" },
        ]}
      />
      <FooterColumn
        title="Support"
        variant="tracking-[0.8px] order-4"
        items={[
          { text: "Contact", type: "button" },
          { text: "Give us feedback & earn", type: "button" },
          { text: "Suggest a feature & earn", type: "button" },
          { text: "Suggest a new topic or expert", type: "button" },
          { text: "Policy", href: "https://intro.co/contact", type: "link" },
          { text: "Terms", href: "https://intro.co/terms", type: "link" },
        ]}
      />
      <FooterColumn
        title="Follow us"
        variant="order-2 mb-6"
        items={[]}
        socialLinks={[
          {
            href: "https://x.com/intro",
            alt: "Twitter Logo",
            src: "https://c.animaapp.com/mi6gt1o5MYP0P1/assets/social-icon-twitter.svg",
            className:
              "text-base box-border caret-transparent inline leading-6 min-h-0 min-w-0 ml-5 md:text-sm md:block md:leading-[21px] md:min-h-[auto] md:min-w-[auto]",
          },
          {
            href: "https://www.instagram.com/useintro/",
            alt: "Instagram Logo",
            src: "https://c.animaapp.com/mi6gt1o5MYP0P1/assets/social-icon-instagram.svg",
            className:
              "text-base box-border caret-transparent inline leading-6 min-h-0 min-w-0 md:text-sm md:block md:leading-[21px] md:min-h-[auto] md:min-w-[auto]",
          },
        ]}
      />
    </div>
  );
};
