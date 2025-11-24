import { HowItWorksStep } from "@/sections/HowItWorks/components/HowItWorksStep";

export const HowItWorks = () => {
  return (
    <div className="box-border caret-transparent w-full mx-[18px] px-[22px] md:mx-10 md:px-10">
      <div className="box-border caret-transparent gap-x-8 grid justify-center gap-y-8 text-center border-gray-500 pt-10 pb-12 border-t border-solid md:flex md:justify-between">
        <HowItWorksStep
          iconSrc="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/call-to-action-icon-find-expert.svg"
          iconClassName="aspect-[auto_68_/_68] w-[68px]"
          title="Find an expert"
          description="Discover and choose from our list of the world's most in-demand experts"
        />
        <HowItWorksStep
          iconSrc="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/call-to-action-icon-calendar.svg"
          iconClassName="aspect-[auto_64_/_64] w-16 mt-px"
          title="Book or subscribe"
          description="Book a one-time video call or select a plan to access your expert ongoing"
        />
        <HowItWorksStep
          iconSrc="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/call-to-action-icon-video-play.svg"
          iconClassName="aspect-[auto_69_/_67] w-[69px] ml-[3px] mb-0.5"
          title="Virtual consultation"
          description="Join the video call or chat, ask questions, and get expert advice"
        />
      </div>
    </div>
  );
};
