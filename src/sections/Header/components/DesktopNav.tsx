export const DesktopNav = () => {
  return (
    <div className="relative text-[15.2px] items-center box-border caret-transparent flex justify-end leading-[22.8px] min-h-[70px] md:text-base md:leading-6">
      <div className="text-[15.2px] box-border caret-transparent leading-[22.8px] md:text-base md:leading-6">
        <div className="text-[15.2px] box-border caret-transparent flex shrink-0 leading-[22.8px] md:text-base md:hidden md:leading-6">
          <button
            type="button"
            className="text-[15.2px] bg-transparent caret-transparent block shrink-0 leading-[22.8px] min-h-[auto] min-w-[auto] text-center -mt-px p-4 md:text-base md:inline-block md:leading-6 md:min-h-0 md:min-w-0"
          >
            <img
              alt="Search"
              src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/search-mobile-icon.svg"
              className="text-[15.2px] aspect-[auto_21_/_22] box-border caret-transparent leading-[22.8px] max-w-full w-[21px] md:text-base md:leading-6"
            />
          </button>
        </div>
      </div>
      <a
        title="Gift a Session"
        href="/giftcard"
        className="text-[15.2px] box-border caret-transparent hidden shrink-0 leading-[22.8px] min-h-0 min-w-0 -mt-0.5 md:text-base md:block md:leading-6 md:min-h-[auto] md:min-w-[auto]"
      >
        <div className="text-[15.2px] box-border caret-transparent leading-[22.8px] pl-4 py-4 md:text-base md:leading-6">
          <img
            alt="Gift a Session"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/giftbox.png"
            className="text-[15.2px] aspect-[auto_19_/_22] box-border caret-transparent leading-[22.8px] max-w-full w-[19px] md:text-base md:leading-6"
          />
        </div>
      </a>
      <div className="text-[15.2px] box-border caret-transparent hidden shrink-0 leading-[22.8px] min-h-0 min-w-0 ml-5 -mt-px pl-4 py-4 md:text-base md:block md:leading-6 md:min-h-[auto] md:min-w-[auto]">
        <a
          title="Account"
          href="/login?from=%2Fmarketplace%3Ftopic%3DTop%2520Experts"
          className="text-[15.2px] box-border caret-transparent leading-[22.8px] md:text-base md:leading-6"
        >
          <img
            alt="Account"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/header-account-icon.svg"
            className="text-[15.2px] aspect-[auto_16_/_21] box-border caret-transparent leading-[22.8px] max-w-full w-4 md:text-base md:leading-6"
          />
        </a>
      </div>
      <div className="text-[15.2px] box-border caret-transparent shrink-0 leading-[22.8px] ml-0 px-2 py-4 md:text-base md:leading-6 md:ml-3 md:pl-4 md:pr-0">
        <a
          title="Sign up"
          href="/signup?to=%2Fmarketplace%3Ftopic%3DTop%2520Experts&rl=nav"
          className="text-white font-medium items-center bg-zinc-900 box-border caret-transparent flex justify-center pt-1.5 pb-2 px-7 rounded-[28px] md:pt-2 hover:bg-black"
        >
          Sign up
        </a>
      </div>
      <div className="text-[15.2px] items-center box-border caret-transparent flex shrink-0 h-[53px] justify-center leading-[22.8px] min-h-[auto] min-w-[auto] pl-4 py-4 md:text-base md:hidden md:leading-6 md:min-h-0 md:min-w-0">
        <button
          type="button"
          className="text-[15.2px] items-center bg-transparent caret-transparent flex justify-center leading-[22.8px] min-h-[auto] min-w-[auto] text-center w-[22px] -mt-px p-0 md:text-base md:leading-6 md:min-h-0 md:min-w-0"
        >
          <img
            alt="More options"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/hamburger-menu-icon.svg"
            className="text-[15.2px] aspect-[auto_20_/_20] box-border caret-transparent leading-[22.8px] max-w-full min-h-[auto] min-w-[auto] w-5 md:text-base md:leading-6 md:min-h-0 md:min-w-0"
          />
        </button>
      </div>
    </div>
  );
};
