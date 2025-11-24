export const CategoryTabList = () => {
  return (
    <div className="box-border caret-transparent flex overflow-x-auto overflow-y-hidden z-10">
      <div className="box-border caret-transparent h-full w-px"></div>
      <div className="box-border caret-transparent flex">
        <div className="box-border caret-transparent snap-start pl-[22px] md:pl-10">
          <button
            type="button"
            className="bg-transparent caret-transparent flex flex-col text-center w-[86px] p-0"
          >
            <img
              alt="All Experts"
              src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/top_experts.jpg"
              className="aspect-[auto_86_/_86] box-border caret-transparent w-[86px] rounded-full"
            />
            <span className="self-center box-border caret-transparent block mt-3 pb-3 border-b-2 border-solid border-transparent">
              All Experts
            </span>
          </button>
        </div>
        <button
          type="button"
          className="items-center bg-transparent caret-transparent flex flex-col snap-start text-center pl-[25px] pr-0 py-0 scroll-m-6"
        >
          <img
            alt="Top Experts"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/top_experts.webp"
            className="aspect-[auto_86_/_86] box-border caret-transparent w-[86px] rounded-full"
          />
          <span className="text-black font-semibold box-border caret-transparent block mt-3 pb-3 border-b-2 border-solid">
            Top Experts
          </span>
        </button>
        <button
          type="button"
          className="items-center bg-transparent caret-transparent flex flex-col shrink-0 snap-start text-center pl-[25px] pr-0 py-0 scroll-m-6"
        >
          <img
            alt="Home"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/home.webp"
            className="aspect-[auto_86_/_86] box-border caret-transparent w-[86px] rounded-full"
          />
          <span className="box-border caret-transparent block mt-3 pb-3 border-b-2 border-solid border-transparent">
            Home
          </span>
        </button>
        <button
          type="button"
          className="items-center bg-transparent caret-transparent flex flex-col shrink-0 snap-start text-center pl-[25px] pr-0 py-0 scroll-m-6"
        >
          <img
            alt="Wellness"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/wellness.webp"
            className="aspect-[auto_86_/_86] box-border caret-transparent w-[86px] rounded-full"
          />
          <span className="box-border caret-transparent block mt-3 pb-3 border-b-2 border-solid border-transparent">
            Wellness
          </span>
        </button>
        <button
          type="button"
          className="items-center bg-transparent caret-transparent flex flex-col shrink-0 snap-start text-center pl-[25px] pr-0 py-0 scroll-m-6"
        >
          <img
            alt="Career & Business"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/business.webp"
            className="aspect-[auto_86_/_86] box-border caret-transparent w-[86px] rounded-full"
          />
          <span className="box-border caret-transparent block mt-3 pb-3 border-b-2 border-solid border-transparent">
            Career &amp; Business
          </span>
        </button>
        <button
          type="button"
          className="items-center bg-transparent caret-transparent flex flex-col shrink-0 snap-start text-center pl-[25px] pr-0 py-0 scroll-m-6"
        >
          <img
            alt="Style & Beauty"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/style.webp"
            className="aspect-[auto_86_/_86] box-border caret-transparent w-[86px] rounded-full"
          />
          <span className="box-border caret-transparent block mt-3 pb-3 border-b-2 border-solid border-transparent">
            Style &amp; Beauty
          </span>
        </button>
        <button
          type="button"
          className="items-center bg-transparent caret-transparent flex flex-col shrink-0 snap-start text-center px-[25px] py-0 scroll-m-6"
        >
          <img
            alt="Astrology & more"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/astrology.webp"
            className="aspect-[auto_86_/_86] box-border caret-transparent w-[86px] rounded-full"
          />
          <span className="box-border caret-transparent block mt-3 pb-3 border-b-2 border-solid border-transparent">
            Astrology &amp; more
          </span>
        </button>
      </div>
      <div className="box-border caret-transparent h-full w-px"></div>
    </div>
  );
};
