import { CategoryTabs } from "@/sections/CategoryFilter/components/CategoryTabs";
import { MobileFilterButton } from "@/sections/CategoryFilter/components/MobileFilterButton";
import { TopicFilter } from "@/sections/CategoryFilter/components/TopicFilter";

export const CategoryFilter = () => {
  return (
    <div className="box-border caret-transparent max-w-full w-full mb-8 md:mb-6">
      <div className="box-border caret-transparent">
        <div className="text-neutral-500 text-xs items-center box-border caret-transparent flex flex-col-reverse justify-between leading-[18px] md:flex-row">
          <CategoryTabs />
          <div className="box-border caret-transparent block min-h-[auto] min-w-[auto] w-full mb-4 px-[22px] md:hidden md:min-h-0 md:min-w-0 md:px-0">
            <p className="text-[26px] box-border caret-transparent block leading-[30px] mb-4 md:hidden">
              Book in-demand experts &amp; get advice over a video call
            </p>
          </div>
          <MobileFilterButton />
        </div>
        <TopicFilter />
      </div>
    </div>
  );
};
