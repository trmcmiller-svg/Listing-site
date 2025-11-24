export type HowItWorksStepProps = {
  iconSrc: string;
  iconClassName: string;
  title: string;
  description: string;
};

export const HowItWorksStep = (props: HowItWorksStepProps) => {
  return (
    <div className="items-center bg-zinc-100 box-border caret-transparent flex flex-col w-full px-[25px] py-[72px] rounded-lg md:py-[50px]">
      <img
        src={props.iconSrc}
        alt="icon"
        className={`box-border caret-transparent max-w-full ${props.iconClassName}`}
      />
      <h3 className="text-[23px] box-border caret-transparent leading-[34.5px] mt-6 mb-2">
        {props.title}
      </h3>
      <p className="text-lg font-light box-border caret-transparent leading-[27px] px-8 md:px-0">
        {props.description}
      </p>
    </div>
  );
};
