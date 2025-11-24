export type FooterColumnProps = {
  title: string;
  variant: string;
  items: Array<{
    text: string;
    href?: string;
    type: "link" | "button";
  }>;
  socialLinks?: Array<{
    href: string;
    alt: string;
    src: string;
    className: string;
  }>;
};

export const FooterColumn = (props: FooterColumnProps) => {
  return (
    <div
      className={`text-base box-border caret-transparent leading-6 border-zinc-300 pb-7 border-b border-solid md:text-sm md:leading-[21px] md:order-none md:pb-0 md:border-b-0 ${props.variant}`}
    >
      <h3
        className={`text-base font-bold box-border caret-transparent leading-6 mb-6 md:text-sm md:leading-[21px] md:mb-4 ${props.title === "Follow us" ? "" : "tracking-[0.8px] md:tracking-[0.7px]"}`}
      >
        {props.title}
      </h3>
      {props.socialLinks ? (
        <>
          <div className="text-base box-border caret-transparent hidden flex-row-reverse leading-6 md:text-sm md:flex md:leading-[21px]">
            {props.socialLinks.map((social, index) => (
              <a key={index} href={social.href} className={social.className}>
                <img
                  alt={social.alt}
                  src={social.src}
                  className="text-base aspect-[auto_34_/_34] box-border caret-transparent leading-6 max-w-full w-[34px] md:text-sm md:leading-[21px]"
                />
              </a>
            ))}
          </div>
          <div className="text-base box-border caret-transparent flex leading-6 md:text-sm md:hidden md:leading-[21px]">
            {props.socialLinks
              .slice()
              .reverse()
              .map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={
                    index === 0
                      ? "text-base box-border caret-transparent block leading-6 min-h-[auto] min-w-[auto] mr-5 md:text-sm md:inline md:leading-[21px] md:min-h-0 md:min-w-0"
                      : "text-base box-border caret-transparent block leading-6 min-h-[auto] min-w-[auto] md:text-sm md:inline md:leading-[21px] md:min-h-0 md:min-w-0"
                  }
                >
                  <img
                    alt={social.alt}
                    src={social.src}
                    className="text-base aspect-[auto_32_/_32] box-border caret-transparent leading-6 max-w-full w-8 md:text-sm md:leading-[21px]"
                  />
                </a>
              ))}
          </div>
        </>
      ) : (
        <ul className="text-base font-light box-border caret-transparent tracking-[0.8px] leading-4 list-none pl-0 md:text-sm md:tracking-[0.7px]">
          {props.items.map((item, index) => (
            <li
              key={index}
              className={
                index === 0
                  ? "text-base box-border caret-transparent tracking-[0.8px] md:text-sm md:tracking-[0.7px]"
                  : item.text === "Policy" || item.text === "Terms"
                    ? "text-base box-border caret-transparent block tracking-[0.8px] mt-6 md:text-sm md:hidden md:tracking-[0.7px] md:mt-5"
                    : "text-base box-border caret-transparent tracking-[0.8px] mt-6 md:text-sm md:tracking-[0.7px] md:mt-5"
              }
            >
              {item.type === "link" ? (
                <a
                  href={item.href}
                  className="text-base box-border caret-transparent tracking-[0.8px] md:text-sm md:tracking-[0.7px]"
                >
                  {item.text}
                </a>
              ) : (
                <button
                  type="button"
                  className="text-base bg-transparent caret-transparent text-left w-full p-0 md:text-sm"
                >
                  {item.text}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
