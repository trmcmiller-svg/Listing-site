import { TopicTabList } from "@/sections/CategoryFilter/components/TopicTabList";

export const TopicFilter = () => {
  return (
    <div className="relative box-border caret-transparent w-full overflow-auto mt-6 mb-2 after:md:accent-auto after:md:bg-[linear-gradient(270deg,rgba(255,255,255,0.98)_20%,rgba(255,255,255,0)_80%)] after:md:box-border after:md:caret-transparent after:md:text-black after:md:block after:md:text-base after:md:not-italic after:md:normal-nums after:md:font-normal after:md:h-full after:md:tracking-[normal] after:md:leading-6 after:md:list-outside after:md:list-disc after:md:pointer-events-none after:md:absolute after:md:text-start after:md:no-underline after:md:indent-[0px] after:md:normal-case after:md:visible after:md:w-[50px] after:md:border-separate after:md:right-0 after:md:top-0 after:md:font-sofia">
      <div className="relative box-border caret-transparent">
        <TopicTabList />
        <div className="box-border caret-transparent">
          <div className="absolute box-border caret-transparent w-[30px] z-20 left-0 inset-y-0"></div>
          <div className="static box-content caret-black opacity-100 transform-none w-auto z-auto right-auto inset-y-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:opacity-[0.999157] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:translate-x-[0.407389px] md:w-[30px] md:z-20 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:right-0 md:inset-y-0"></div>
        </div>
      </div>
    </div>
  );
};
