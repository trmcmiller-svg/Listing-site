export const FooterCopyright = () => {
  return (
    <div className="text-xs items-start box-border caret-transparent flex leading-[18px] mx-auto pt-1 px-[22px] md:text-[13px] md:leading-[19.5px] md:pt-3 md:px-10">
      <span className="text-xs box-border caret-transparent block leading-[18px] md:text-[13px] md:leading-[19.5px]">
        © Intro 2025. All rights reserved
      </span>
      <span className="text-xs box-border caret-transparent hidden leading-[18px] min-h-0 min-w-0 ml-0 md:text-[13px] md:block md:leading-[19.5px] md:min-h-[auto] md:min-w-[auto] md:ml-2">
        •
      </span>
      <a
        href="https://intro.co/policy"
        title="Privacy Policy"
        className="text-xs box-border caret-transparent hidden leading-[18px] min-h-0 min-w-0 ml-0 md:text-[13px] md:block md:leading-[19.5px] md:min-h-[auto] md:min-w-[auto] md:ml-2"
      >
        Policy
      </a>
      <span className="text-xs box-border caret-transparent hidden leading-[18px] min-h-0 min-w-0 ml-0 md:text-[13px] md:block md:leading-[19.5px] md:min-h-[auto] md:min-w-[auto] md:ml-2">
        •
      </span>
      <a
        href="https://intro.co/terms"
        title="Terms of Service"
        className="text-xs box-border caret-transparent hidden leading-[18px] min-h-0 min-w-0 ml-0 md:text-[13px] md:block md:leading-[19.5px] md:min-h-[auto] md:min-w-[auto] md:ml-2"
      >
        Terms
      </a>
    </div>
  );
};
