export const MobileMenu = () => {
  return (
    <div className="fixed box-border caret-transparent hidden h-full w-full z-[100] left-0 top-0">
      <div className="absolute bg-black/50 box-border caret-transparent h-full w-full z-[100] left-0 top-0"></div>
      <div className="absolute box-border caret-transparent h-[370px] max-w-none w-full z-[9999] m-auto rounded-t-2xl rounded-b-none top-auto bottom-0 inset-x-0 md:max-w-[375px] md:w-[375px] md:rounded-b-2xl md:top-0">
        <div className="absolute bg-white shadow-[rgba(0,0,0,0.37)_0px_1px_4px_0px] box-border caret-transparent max-w-none w-full border border-neutral-200 p-5 rounded-t-2xl rounded-b-none border-solid left-0 top-auto bottom-0 md:max-w-[375px] md:rounded-b-2xl md:left-2/4 md:top-2/4 md:bottom-auto">
          <div className="box-border caret-transparent mb-[26px]">
            <div className="box-border caret-transparent">
              <div className="box-border caret-transparent flex justify-end">
                <button
                  type="button"
                  className="bg-transparent caret-transparent block text-center p-0"
                >
                  <img
                    alt="Close"
                    src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/intro-popup-close-icon.svg"
                    className="box-border caret-transparent h-[26px] max-w-full w-[26px]"
                  />
                </button>
              </div>
              <p className="text-zinc-900 text-[22px] font-medium box-border caret-transparent flex leading-8">
                Contact us
              </p>
            </div>
            <p className="text-zinc-900 text-lg font-light box-border caret-transparent leading-[27px] mt-2.5">
              Email us at{" "}
              <a
                href="mailto://hi@intro.co?subject=Contact%20us"
                className="font-medium box-border caret-transparent underline"
              >
                hi@intro.co
              </a>
            </p>
          </div>
        </div>
        <span className="absolute box-border caret-transparent hidden h-4 w-4 right-4 top-4 before:accent-auto before:bg-neutral-400 before:box-border before:caret-transparent before:text-black before:block before:text-base before:not-italic before:normal-nums before:font-normal before:h-0.5 before:tracking-[normal] before:leading-6 before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-full before:-mt-px before:rounded-[100%] before:border-separate before:left-0 before:top-2/4 before:font-ui_sans_serif after:accent-auto after:bg-neutral-400 after:box-border after:caret-transparent after:text-black after:block after:text-base after:not-italic after:normal-nums after:font-normal after:h-0.5 after:tracking-[normal] after:leading-6 after:list-outside after:list-disc after:pointer-events-auto after:absolute after:text-start after:indent-[0px] after:normal-case after:visible after:w-full after:-mt-px after:rounded-[100%] after:border-separate after:left-0 after:top-2/4 after:font-ui_sans_serif"></span>
      </div>
    </div>
  );
};
