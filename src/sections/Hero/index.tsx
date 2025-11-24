export const Hero = () => {
  return (
    <div className="box-border caret-transparent hidden min-h-0 min-w-0 w-full mb-4 px-[22px] md:block md:min-h-[auto] md:min-w-[auto] md:px-10">
      <p className="text-neutral-500 text-base box-border caret-transparent leading-6 mr-0 mb-4 md:text-[28px] md:leading-[34px] md:mr-24">
        <span className="text-black text-base box-border caret-transparent leading-6 md:text-[28px] md:leading-[34px]">
          Choose an expert.
        </span>
        Book a session.
        <br className="text-base box-border caret-transparent inline leading-6 md:text-[28px] md:hidden md:leading-[34px]" />
        Get advice over a video call.
      </p>
    </div>
  );
};
