import { TrustBadges } from "../../../components/TrustBadges";

export type ExpertCardProps = {
  href: string;
  imageUrl: string;
  imageAlt: string;
  name: string;
  price: string;
  description: string;
  hasTopExpertBadge?: boolean;
  practitionerId?: string;
  onFavoriteClick?: () => void;
};

export const ExpertCard = (props: ExpertCardProps) => {
  return (
    <div className="box-border caret-transparent w-full">
      <a
        href={props.href}
        className="box-border caret-transparent block w-full"
      >
        <div className="relative aspect-[0.82_/_1] box-border caret-transparent w-full overflow-hidden mb-2.5 rounded-lg">
          <button
            type="button"
            className="absolute bg-transparent caret-transparent flex text-center z-10 p-0 right-2 top-2"
            onClick={props.onFavoriteClick}
          >
            <img
              alt="Favorite"
              src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/favorite-icon.svg"
              className="aspect-[0.82_/_1] box-border caret-transparent h-full max-w-full w-5"
            />
          </button>
          {props.hasTopExpertBadge && (
            <div className="absolute text-sm font-semibold bg-white box-border caret-transparent h-[25px] z-10 px-2 rounded-md left-2 bottom-2">
              Top Expert
            </div>
          )}
          <img
            src={props.imageUrl}
            alt={props.imageAlt}
            title={props.name}
            className="aspect-[0.82_/_1] box-border caret-transparent h-full max-w-full object-cover rounded-lg"
          />
        </div>
        <div className="text-[17px] box-border caret-transparent flex tracking-[0.425px] leading-5 mb-1 md:text-lg md:tracking-[0.45px]">
          <div className="text-[17px] font-medium box-border caret-transparent tracking-[-0.425px] text-ellipsis text-nowrap overflow-hidden md:text-lg md:tracking-[-0.45px]">
            {props.name}
          </div>
          <div className="text-[17px] box-border caret-transparent shrink-0 tracking-[0.425px] md:text-lg md:tracking-[0.45px]">
            <img
              src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/checkmark-gold.svg"
              alt="Top Expert"
              className="text-[17px] aspect-[auto_14_/_14] box-border caret-transparent inline-block tracking-[0.425px] max-w-full w-3.5 ml-1 mb-1 md:text-lg md:tracking-[0.45px]"
            />
          </div>
        </div>
        {props.practitionerId && (
          <div className="mb-2">
            <TrustBadges practitionerId={props.practitionerId} size="sm" />
          </div>
        )}
        <div className="text-sm box-border caret-transparent leading-[14px] mb-2 font-sf_pro_text">
          {props.price}
        </div>
        <p className="text-stone-500 text-[15px] font-light box-border caret-transparent flow-root leading-[18px] max-w-fit overflow-hidden">
          {props.description}
        </p>
      </a>
    </div>
  );
};
