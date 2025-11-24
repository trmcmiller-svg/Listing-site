export const DesktopSearch = () => {
  return (
    <div className="relative items-center box-border caret-transparent hidden grow justify-center min-h-0 min-w-0 mx-3 md:flex md:min-h-[auto] md:min-w-[auto]">
      <div className="relative box-border caret-transparent hidden min-h-0 min-w-0 w-full md:block md:min-h-[auto] md:min-w-[auto]">
        <input
          type="text"
          placeholder="Search experts"
          value=""
          className="box-border caret-transparent h-[49px] w-full border border-gray-200 my-[7px] pl-10 pr-0 py-0 rounded-xl border-solid md:pl-6"
        />
        <div className="absolute box-border caret-transparent left-4 right-auto top-6 md:left-auto md:right-5 md:top-[22px]">
          <img
            alt="Search"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/search.svg"
            className="aspect-[auto_18_/_18] box-border caret-transparent max-w-full w-[18px]"
          />
        </div>
      </div>
      <div className="items-center box-border caret-transparent hidden shrink-0 min-h-0 min-w-0 -mt-0.5 md:flex md:min-h-[auto] md:min-w-[auto]">
        <div className="relative box-border caret-transparent min-h-0 min-w-0 mx-2 md:min-h-[auto] md:min-w-[auto]">
          <button
            type="button"
            className="items-center bg-transparent caret-transparent flex justify-center text-center p-4"
          >
            Blog
            <img
              alt="Arrow"
              src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/dropdown-arrow-black.svg"
              className="absolute aspect-[auto_11_/_19] box-border caret-transparent max-w-full w-[11px] -mt-px -right-0.5 top-2/4"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
