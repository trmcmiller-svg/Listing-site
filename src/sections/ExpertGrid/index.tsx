import { ExpertCard } from "@/sections/ExpertGrid/components/ExpertCard";

export const ExpertGrid = () => {
  return (
    <main className="box-border caret-transparent flex flex-col w-full pb-8 px-[22px] md:px-10">
      <div
        role="list"
        className="text-zinc-800 box-border caret-transparent gap-x-5 grid grid-cols-[repeat(2,minmax(0px,1fr))] gap-y-8 md:gap-x-6 md:grid-cols-[repeat(6,minmax(0px,1fr))] md:gap-y-16"
      >
        <ExpertCard
          href="https://intro.co/AlexisOhanian?source=intro"
          imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/177804F4nhK4N2.jpg"
          imageAlt="Alexis Ohanian - Founder of Reddit, Initialized, & 7️⃣7️⃣6️⃣ \n(100% to charity🎗)"
          name="Alexis Ohanian"
          price="$2,000 • Session"
          description="Founder of Reddit, Initialized, & 7️⃣7️⃣6️⃣ \n(100% to charity🎗)"
          hasTopExpertBadge={true}
        />
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/AlliWebb?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/434693CtGEZ_n3.jpg"
            imageAlt="Alli Webb - Founder of Drybar (sold for $255M) Shark Tank Judge, NYT/USA Today Best Selling Author, Advisor"
            name="Alli Webb"
            price="$550 • Session"
            description="Founder of Drybar (sold for $255M) Shark Tank Judge, NYT/USA Today Best Selling Author, Advisor"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/NicolasJammet?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/6204632ijrV2so.jpg"
            imageAlt="Nicolas Jammet - Co-founder of Sweetgreen. NYSE: $SG. Valued $5B+."
            name="Nicolas Jammet"
            price="$500 • Session"
            description="Co-founder of Sweetgreen. NYSE: $SG. Valued $5B+."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/NikitaBier?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/331343IoySNTRz.jpg"
            imageAlt="Nikita Bier - Co-founder of Gas, acquired by Discord. Co-founder of TBH, acquired by Facebook. Angel Investor."
            name="Nikita Bier"
            price="$7,500 • Session"
            description="Co-founder of Gas, acquired by Discord. Co-founder of TBH, acquired by Facebook. Angel Investor."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/HeidiZak?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/258820AuC5lnVX.jpg"
            imageAlt="Heidi Zak - CEO of Thirdlove, an e-commerce lifestyle brand that generates over $100M in revenue"
            name="Heidi Zak"
            price="$400 • Session"
            description="CEO of Thirdlove, an e-commerce lifestyle brand that generates over $100M in revenue"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/JasonTan?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/803646uXF5CQ5A.jpg"
            imageAlt={
              "Jason Tan - 👋 founded & led sift.com (AI security, $1.5B+) thru $100M ARR, 400 ppl\n\n❤️‍🩹 struggled with depression"
            }
            name="Jason Tan"
            price="$450 • Session"
            description={
              "👋 founded & led sift.com (AI security, $1.5B+) thru $100M ARR, 400 ppl\n\n❤️‍🩹 struggled with depression"
            }
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/NancyTwine?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/434212_OH2DCoU.jpg"
            imageAlt="Nancy Twine - Founder of Briogeo (Acq. by Wella). EY Entrepreneur of the Year FL (2024). Let’s grow your biz 🚀"
            name="Nancy Twine"
            price="$1,000 • Session"
            description="Founder of Briogeo (Acq. by Wella). EY Entrepreneur of the Year FL (2024). Let’s grow your biz 🚀"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/ShervinPishevar?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/11305573NbLVJsS.jpg"
            imageAlt="Shervin Pishevar - Early Uber board member & Airbnb investor with $7B+ in returns and 93 exits across 200+ startups."
            name="Shervin Pishevar"
            price="$2,000 • Session"
            description="Early Uber board member & Airbnb investor with $7B+ in returns and 93 exits across 200+ startups."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/BrianLee?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/1060682SHQ5Z-RM.jpg"
            imageAlt="Brian Lee - Co-Founder of LegalZoom ($2B IPO), The Honest Company ($1B IPO), ShoeDazzle, and BAM Ventures."
            name="Brian Lee"
            price="$1,750 • Session"
            description="Co-Founder of LegalZoom ($2B IPO), The Honest Company ($1B IPO), ShoeDazzle, and BAM Ventures."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/ChrisDeWolfe?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/802177A2XTeLZ9.jpg"
            imageAlt="Chris DeWolfe - CEO & Co-founder of MySpace (Sold for $675M & Jam City (2B+Rev) Time 100 Most Influential People"
            name="Chris DeWolfe"
            price="$1,200 • Session"
            description="CEO & Co-founder of MySpace (Sold for $675M & Jam City (2B+Rev) Time 100 Most Influential People"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/GregorySmith?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/832662i7JmXZfY.jpg"
            imageAlt="Gregory Smith - Chairman of American Airlines (valued at $11B+). Fmr CFO of Boeing ($120B+). Co-Founder G2 Equity."
            name="Gregory Smith"
            price="$500 • Session"
            description="Chairman of American Airlines (valued at $11B+). Fmr CFO of Boeing ($120B+). Co-Founder G2 Equity."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/MattHiggins?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/354713vZNNMluc.jpg"
            imageAlt="Matt Higgins - Cofounder/CEO, RSE Ventures; Author, Burn The Boats; Host, Business Hunters; Guest Shark, Shark Tank"
            name="Matt Higgins"
            price="$500 • Session"
            description="Cofounder/CEO, RSE Ventures; Author, Burn The Boats; Host, Business Hunters; Guest Shark, Shark Tank"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/SarahLeary?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/436123seq2ZjO5.jpg"
            imageAlt="Sarah Leary - Co-founder of Nextdoor. Investor. Board Member. Entrepreneur in Residence, Harvard University."
            name="Sarah Leary"
            price="$470 • Session"
            description="Co-founder of Nextdoor. Investor. Board Member. Entrepreneur in Residence, Harvard University."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/AndrewChen?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/178450ghdwT95D.jpg"
            imageAlt="Andrew Chen - General Partner at Andreessen Horowitz and Lead Investor in Intro (this app!!)"
            name="Andrew Chen"
            price="$2,000 • Session"
            description="General Partner at Andreessen Horowitz and Lead Investor in Intro (this app!!)"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/Neilparikh?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/406713URP2OJS0.jpg"
            imageAlt="Neil Parikh - Co-Founder of Casper. Investor in 150+ startups (Affirm, Reddit, Relativity, Ro, Tia) and Coach"
            name="Neil Parikh"
            price="$1,250 • Session"
            description="Co-Founder of Casper. Investor in 150+ startups (Affirm, Reddit, Relativity, Ro, Tia) and Coach"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/ChristopherGavigan?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/551368XXCmRZ38.jpg"
            imageAlt="Christopher Gavigan - Founder of The Honest Co. (NASDAQ: HNST) & PRIMA (acquired); Board Member & Angel Investor"
            name="Christopher Gavigan"
            price="$750 • Session"
            description="Founder of The Honest Co. (NASDAQ: HNST) & PRIMA (acquired); Board Member & Angel Investor"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/NickHuzar?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/4228057tgd-l15.jpg"
            imageAlt="Nick Huzar - Founder @ OfferUp (largest local marketplace in U.S.) Top shopping app. 150M installs to date."
            name="Nick Huzar"
            price="$475 • Session"
            description="Founder @ OfferUp (largest local marketplace in U.S.) Top shopping app. 150M installs to date."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/NateBerkus?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/149759i1SI98G3.jpg"
            imageAlt="Nate Berkus - AD 100, Elle Décor A-List. Renowned interior designer with clients such as Oprah"
            name="Nate Berkus"
            price="$900 • Session"
            description="AD 100, Elle Décor A-List. Renowned interior designer with clients such as Oprah"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/ScottCohen?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/417729OCYiYmqG.jpg"
            imageAlt="Scott Cohen - Co-founder of Byte  ($1B+ all cash exit without taking any VC funding)."
            name="Scott Cohen"
            price="$1,500 • Session"
            description="Co-founder of Byte  ($1B+ all cash exit without taking any VC funding)."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/SamiClarke?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/21290-I9CMNsc.jpg"
            imageAlt="Sami Clarke - Sami is a celebrity fitness & wellness creator (1M+ audience). Founder of FORM, a top wellness app."
            name="Sami Clarke"
            price="$225 • Session"
            description="Sami is a celebrity fitness & wellness creator (1M+ audience). Founder of FORM, a top wellness app."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/EmeryWells?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/832415R0ONLw8S.jpg"
            imageAlt="Emery Wells - Founder, CEO of @Frame.io. Acquired by Adobe $1.3B."
            name="Emery Wells"
            price="$2,500 • Session"
            description="Founder, CEO of @Frame.io. Acquired by Adobe $1.3B."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/TJParker?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/1019043SCkj-vm3.jpg"
            imageAlt="TJ Parker - Founder of PillPack (acq. by Amazon for $1B), former VP at Amazon Pharmacy. Now: Investor at Matrix"
            name="TJ Parker"
            price="$400 • Session"
            description="Founder of PillPack (acq. by Amazon for $1B), former VP at Amazon Pharmacy. Now: Investor at Matrix"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/JoelFlory?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/1125513XHwLWkvE.jpg"
            imageAlt="Joel Flory - Co-founder & ex-CEO of VSCO. Scaled to 300M+ creators, $100M+ funding."
            name="Joel Flory"
            price="$400 • Session"
            description="Co-founder & ex-CEO of VSCO. Scaled to 300M+ creators, $100M+ funding."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/DavidSpector?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/848704URvJNV3_.jpg"
            imageAlt="David Spector - Co-founder ThirdLove ($1bn rev) / Former Sequoia Capital / Master of Pitch Decks & Salesmanship 🎯🚀"
            name="David Spector"
            price="$300 • Session"
            description="Co-founder ThirdLove ($1bn rev) / Former Sequoia Capital / Master of Pitch Decks & Salesmanship 🎯🚀"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/joff?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/6336065sZYsHCO.jpg"
            imageAlt="Joff Redfern - Partner at Menlo Ventures. Former CPO at Atlassian & VP of Product at LinkedIn, Yahoo, and Fidelity."
            name="Joff Redfern"
            price="$425 • Session"
            description="Partner at Menlo Ventures. Former CPO at Atlassian & VP of Product at LinkedIn, Yahoo, and Fidelity."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/BenWeiss?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/527474kxHJZRJH.jpg"
            imageAlt="Ben Weiss - Founder @DrinkBai (sold for $1.7B), Host of Billion Dollar Idea Fox Business, Author Basementality."
            name="Ben Weiss"
            price="$550 • Session"
            description="Founder @DrinkBai (sold for $1.7B), Host of Billion Dollar Idea Fox Business, Author Basementality."
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/MichaelPreysman?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/540214waUc0WEW.jpg"
            imageAlt="Michael Preysman - Founder, CEO of Everlane ($200M in revenue)"
            name="Michael Preysman"
            price="$400 • Session"
            description="Founder, CEO of Everlane ($200M in revenue)"
            hasTopExpertBadge={true}
          />
        </div>
        <div className="box-border caret-transparent">
          <ExpertCard
            href="https://intro.co/HernanLopez?source=intro"
            imageUrl="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/1055209E1jParG7.jpg"
            imageAlt="Hernan Lopez - Founder of Wondery ($300M exit, now part of Amazon) Fmr. CEO of Fox Int’l Channels ($3B+ in rev)."
            name="Hernan Lopez"
            price="$450 • Session"
            description="Founder of Wondery ($300M exit, now part of Amazon) Fmr. CEO of Fox Int’l Channels ($3B+ in rev)."
            hasTopExpertBadge={true}
          />
        </div>
      </div>
      <div className="box-border caret-transparent flex justify-center align-middle mt-8">
        <button
          type="button"
          className="text-xl font-medium bg-transparent caret-transparent block leading-[30px] text-center px-9 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
        >
          More experts
        </button>
      </div>
    </main>
  );
};
