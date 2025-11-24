import { CategoryTabList } from "@/sections/CategoryFilter/components/CategoryTabList";

export const CategoryTabs = () => {
  return (
    <div className="relative box-border caret-transparent w-full overflow-auto after:md:accent-auto after:md:bg-[linear-gradient(270deg,rgba(255,255,255,0.98)_0px,rgba(255,255,255,0))] after:md:box-border after:md:caret-transparent after:md:text-neutral-500 after:md:block after:md:text-xs after:md:not-italic after:md:normal-nums after:md:font-normal after:md:h-full after:md:tracking-[normal] after:md:leading-[18px] after:md:list-outside after:md:list-disc after:md:pointer-events-none after:md:absolute after:md:text-start after:md:no-underline after:md:indent-[0px] after:md:normal-case after:md:visible after:md:w-10 after:md:border-separate after:md:right-0 after:md:top-0 after:md:font-sofia">
      <div className="relative box-border caret-transparent">
        <CategoryTabList />
        <div className="box-border caret-transparent">
          <div className="static box-content caret-black opacity-100 transform-none w-auto z-auto right-auto inset-y-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:opacity-0 md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:translate-x-[100px] md:w-[30px] md:z-20 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:right-0 md:inset-y-0"></div>
        </div>
      </div>
    </div>
  );
};
