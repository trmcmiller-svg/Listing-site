import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const DesktopNav = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (userRole === "patient") return "/patient-dashboard";
    if (userRole === "provider") return "/provider-dashboard";
    if (userRole === "admin") return "/admin-dashboard";
    return "/";
  };

  return (
    <div className="relative text-[15.2px] items-center box-border caret-transparent flex justify-end leading-[22.8px] min-h-[70px] md:text-base md:gap-4 md:leading-6">
      {user ? (
        <>
          <Link
            to={getDashboardLink()}
            className="text-[15.2px] box-border caret-transparent hidden shrink-0 leading-[22.8px] text-gray-700 hover:text-gray-900 font-medium md:text-base md:block md:leading-6"
          >
            Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="text-white font-medium items-center bg-zinc-900 box-border caret-transparent flex justify-center pt-1.5 pb-2 px-7 rounded-[28px] md:pt-2 hover:bg-black"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <Link
            to="/signin"
            className="text-[15.2px] box-border caret-transparent hidden shrink-0 leading-[22.8px] text-gray-700 hover:text-gray-900 font-medium md:text-base md:block md:leading-6"
          >
            Sign In
          </Link>
          <Link
            to="/join"
            className="text-white font-medium items-center bg-zinc-900 box-border caret-transparent flex justify-center pt-1.5 pb-2 px-7 rounded-[28px] md:pt-2 hover:bg-black"
          >
            Sign Up
          </Link>
        </>
      )}
      <div className="text-[15.2px] items-center box-border caret-transparent flex shrink-0 h-[53px] justify-center leading-[22.8px] min-h-[auto] min-w-[auto] pl-4 py-4 md:text-base md:hidden md:leading-6 md:min-h-0 md:min-w-0">
        <button
          type="button"
          className="text-[15.2px] items-center bg-transparent caret-transparent flex justify-center leading-[22.8px] min-h-[auto] min-w-[auto] text-center w-[22px] -mt-px p-0 md:text-base md:leading-6 md:min-h-0 md:min-w-0"
        >
          <img
            alt="More options"
            src="https://c.animaapp.com/mi6gt1o5MYP0P1/assets/hamburger-menu-icon.svg"
            className="text-[15.2px] aspect-[auto_20_/_20] box-border caret-transparent leading-[22.8px] max-w-full min-h-[auto] min-w-[auto] w-5 md:text-base md:leading-6 md:min-h-0 md:min-w-0"
          />
        </button>
      </div>
    </div>
  );
};
