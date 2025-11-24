import { FilterModal } from "@/sections/CategoryFilter/components/FilterModal";

export const MobileFilterButton = () => {
  return (
    <div className="relative items-center self-start box-border caret-transparent flex w-full border-zinc-300 mt-0 pl-0 pr-[22px] pt-0 border-l-0 border-solid md:w-auto md:mt-[5px] md:pl-6 md:pr-10 md:pt-[9px] md:border-l">
      <button
        type="button"
        className="relative text-black text-[13px] items-center self-start bg-transparent caret-transparent hidden shrink-0 h-14 justify-center leading-[19.5px] min-h-0 min-w-0 text-center w-14 border border-neutral-400 mt-2 mb-0 p-0 rounded-xl border-solid top-auto md:flex md:min-h-[auto] md:min-w-[auto] md:w-[88px] md:my-3.5 md:-top-1.5"
      >
        <img
          alt=""
          src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/filters.svg"
          className="aspect-[auto_13_/_15] box-border caret-transparent max-w-full min-h-0 min-w-0 w-[13px] md:min-h-[auto] md:min-w-[auto]"
        />
        <span className="box-border caret-transparent inline min-h-0 min-w-0 ml-2 md:block md:min-h-[auto] md:min-w-[auto]">
          Filters
        </span>
      </button>
      <FilterModal />
    </div>
  );
};
