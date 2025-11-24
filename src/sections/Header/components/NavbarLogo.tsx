export const NavbarLogo = () => {
  return (
    <div className="relative box-border caret-transparent">
      <div className="items-center self-center box-border caret-transparent flex shrink-0">
        <a href="/" className="box-border caret-transparent block ml-0.5 mr-5">
          <img
            alt="back arrow"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/intro-back.svg"
            className="aspect-[auto_13_/_21] box-border caret-transparent max-w-full w-[13px]"
          />
        </a>
        <a
          href="https://intro.co/"
          className="box-border caret-transparent block ml-px mb-1 pr-3 py-3"
        >
          <img
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/icon-1.svg"
            alt="Icon"
            className="box-border caret-transparent h-7 w-[84px]"
          />
        </a>
      </div>
    </div>
  );
};
