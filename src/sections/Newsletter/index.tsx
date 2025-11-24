export const Newsletter = () => {
  return (
    <div className="bg-[url('https://intro.co/background-email-signup.jpg')] bg-size-[auto,cover] box-border caret-transparent flex justify-center w-full bg-[position:0%,50%_0%,66%] mx-8 pt-16 pb-10 md:mx-4 md:py-32">
      <div className="box-border caret-transparent w-full">
        <p className="text-white text-3xl box-border caret-transparent leading-9 max-w-none text-center mb-12 mx-auto px-10 md:text-[40px] md:leading-[46px] md:max-w-[720px] md:px-8">
          Get $10 off your first session &amp; access to secret events
        </p>
        <div className="box-border caret-transparent flex flex-col justify-center max-w-[532px] mx-4 px-8 md:flex-row md:mx-auto md:px-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="text-lg box-border caret-transparent block h-[54px] leading-[27px] max-w-none w-full mr-2 mb-3 pt-[17px] pb-[15px] px-4 rounded-md md:max-w-xs md:mb-0"
          />
          <button
            type="button"
            className="text-white text-xl font-medium bg-blue-600 caret-transparent block grow h-[54px] leading-5 min-w-[235px] text-center text-nowrap px-8 py-4 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
