export const FooterBrand = () => {
  return (
    <div className="box-border caret-transparent col-end-[span_3] col-start-[span_3] order-1 w-auto md:order-none md:w-[352px]">
      <div className="box-border caret-transparent hidden mb-[21px] md:block">
        <a href="https://intro.co/" className="box-border caret-transparent">
          <img
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/icon-2.svg"
            alt="Icon"
            className="box-border caret-transparent h-[27px] w-20"
          />
        </a>
      </div>
      <div className="box-border caret-transparent block mb-[42px] md:hidden">
        <a href="https://intro.co/" className="box-border caret-transparent">
          <img
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/icon-3.svg"
            alt="Icon"
            className="box-border caret-transparent h-[34px] w-[100px]"
          />
        </a>
      </div>
      <div className="box-border caret-transparent mb-12">
        <p className="text-[22px] font-extralight box-border caret-transparent leading-8 md:leading-7">
          Book the most in-demand experts &amp; get advice over a video call
        </p>
      </div>
      <a
        href="https://intro.co/experts"
        title="Become an Expert"
        className="text-[19px] box-border caret-transparent block leading-[28.5px] text-center w-full border border-gray-200 mb-9 px-[50px] py-3 rounded-sm border-solid md:text-xl md:leading-[30px] md:w-fit md:mb-0"
      >
        Become an Expert
      </a>
    </div>
  );
};
