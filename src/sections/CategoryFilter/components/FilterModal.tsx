export const FilterModal = () => {
  return (
    <div className="fixed box-border caret-transparent hidden h-full w-full z-[100] left-0 top-0">
      <div className="absolute bg-black/50 box-border caret-transparent h-full w-full z-[100] left-0 top-0"></div>
      <div className="absolute box-border caret-transparent h-[370px] max-w-none w-full z-[101] m-auto rounded-t-2xl rounded-b-none top-auto bottom-0 inset-x-0 md:max-w-[375px] md:w-[375px] md:rounded-b-2xl md:top-0">
        <div className="absolute bg-white shadow-[rgba(0,0,0,0.37)_0px_1px_4px_0px] box-border caret-transparent max-w-none w-full border border-neutral-200 pt-8 pb-[26px] px-[25px] rounded-t-2xl rounded-b-none border-solid left-0 top-auto bottom-0 md:max-w-[375px] md:pb-8 md:rounded-b-2xl md:left-2/4 md:top-2/4 md:bottom-auto">
          <div className="text-black box-border caret-transparent">
            <div className="items-center box-border caret-transparent flex justify-between border-zinc-300 pb-5 border-b border-solid">
              <button
                type="button"
                className="bg-transparent caret-transparent block text-center p-0"
              >
                <img
                  src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/close-button.svg"
                  alt="Close"
                  className="aspect-[auto_23_/_23] box-border caret-transparent max-w-full w-[23px]"
                />
              </button>
              <button
                type="button"
                className="text-blue-600 text-lg font-light bg-transparent caret-transparent block leading-[27px] text-center p-0"
              >
                Reset
              </button>
            </div>
            <div className="text-lg font-light box-border caret-transparent leading-[27px] pt-5">
              <h3 className="text-2xl font-medium box-border caret-transparent leading-9 pb-5">
                Sort by
              </h3>
              <ul className="box-border caret-transparent list-none pl-0">
                <li className="box-border caret-transparent pb-5">
                  <label className="box-border caret-transparent inline-block">
                    <input
                      type="radio"
                      name="sort"
                      value=""
                      className="text-base bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%22-4%20-4%208%208%22%3E%3Ccircle%20r=%223%22%20fill=%22%23000%22/%3E%3C/svg%3E)] box-border caret-transparent h-6 leading-6 align-bottom w-6 border border-neutral-400 mr-4 p-0 rounded-full border-solid"
                    />
                    Recommended
                  </label>
                </li>
                <li className="box-border caret-transparent pb-5">
                  <label className="box-border caret-transparent inline-block">
                    <input
                      type="radio"
                      name="sort"
                      value=""
                      className="text-base box-border caret-transparent h-6 leading-6 align-bottom w-6 border border-neutral-400 mr-4 p-0 rounded-full border-solid"
                    />
                    Price high - low
                  </label>
                </li>
                <li className="box-border caret-transparent pb-5">
                  <label className="box-border caret-transparent inline-block">
                    <input
                      type="radio"
                      name="sort"
                      value=""
                      className="text-base box-border caret-transparent h-6 leading-6 align-bottom w-6 border border-neutral-400 mr-4 p-0 rounded-full border-solid"
                    />
                    Price low - high
                  </label>
                </li>
                <li className="box-border caret-transparent pb-5">
                  <label className="box-border caret-transparent inline-block">
                    <input
                      type="radio"
                      name="sort"
                      value=""
                      className="text-base box-border caret-transparent h-6 leading-6 align-bottom w-6 border border-neutral-400 mr-4 p-0 rounded-full border-solid"
                    />
                    Highest ratings
                  </label>
                </li>
                <li className="box-border caret-transparent pb-5">
                  <label className="box-border caret-transparent inline-block">
                    <input
                      type="radio"
                      name="sort"
                      value=""
                      className="text-base box-border caret-transparent h-6 leading-6 align-bottom w-6 border border-neutral-400 mr-4 p-0 rounded-full border-solid"
                    />
                    Most reviewed
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <span className="absolute box-border caret-transparent hidden h-4 w-4 right-4 top-4 before:accent-auto before:bg-neutral-400 before:box-border before:caret-transparent before:text-neutral-500 before:block before:text-xs before:not-italic before:normal-nums before:font-normal before:h-0.5 before:tracking-[normal] before:leading-[18px] before:list-outside before:list-disc before:pointer-events-auto before:absolute before:text-start before:indent-[0px] before:normal-case before:visible before:w-full before:-mt-px before:rounded-[100%] before:border-separate before:left-0 before:top-2/4 before:font-sofia after:accent-auto after:bg-neutral-400 after:box-border after:caret-transparent after:text-neutral-500 after:block after:text-xs after:not-italic after:normal-nums after:font-normal after:h-0.5 after:tracking-[normal] after:leading-[18px] after:list-outside after:list-disc after:pointer-events-auto after:absolute after:text-start after:indent-[0px] after:normal-case after:visible after:w-full after:-mt-px after:rounded-[100%] after:border-separate after:left-0 after:top-2/4 after:font-sofia"></span>
      </div>
    </div>
  );
};
