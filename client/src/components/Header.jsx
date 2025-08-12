import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, UserRound } from "lucide-react";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";

const Header = ({ openCartSection }) => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();

  const redirectToLoginPage = () => navigate("/login");
  const handleCloseUserMenu = () => setOpenUserMenu(false);
  const handleMobileUser = () => {
    if (!user._id) return navigate("/login");
    navigate("/user");
  };
  const handleHomeClick = () => navigate("/", { replace: true });

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:py-5">
          {/* Mobile View */}
          <div className="lg:hidden w-full flex items-center justify-between gap-4">
            {/* Home Icon */}
            <button onClick={handleHomeClick} className="shrink-0 text-neutral-700">
              <Home size={26} />
            </button>
            
             {/* User Icon */}
            <button
              className="shrink-0 text-neutral-600"
              onClick={handleMobileUser}
            >
              <UserRound size={26} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 px-2">
              <Search />
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex items-center w-full gap-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="logo"
                  className="w-[180px] max-w-full h-auto"
                />
              </Link>
              {/* Home */}
              <button
                onClick={handleHomeClick}
                className="flex items-center gap-2 text-green-800 hover:text-green-700 px-3 py-2 rounded-md hover:bg-green-100 transition"
              >
                <Home size={24} />
                <span className="text-lg font-medium">Home</span>
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-3xl px-4">
              <Search />
            </div>

            {/* User + Cart */}
            <div className="flex items-center gap-6 shrink-0">
              {/* User / Login */}
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex items-center gap-1 cursor-pointer select-none text-sm font-medium"
                  >
                    <span>Account</span>
                    {openUserMenu ? (
                      <GoTriangleUp size={20} />
                    ) : (
                      <GoTriangleDown size={20} />
                    )}
                  </div>

                  {openUserMenu && (
                    <div className="absolute right-0 top-10 z-10">
                      <div className="bg-white rounded-xl p-4 min-w-52 shadow-lg border border-gray-200">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="flex items-center gap-2 text-green-800 hover:text-green-700 px-3 py-2 rounded-md hover:bg-green-100 transition"
                >
                  <UserRound size={26} />
                  <span className="text-lg font-medium">Login</span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => openCartSection(true)}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition shadow-sm"
              >
                <BsCart4 size={24} className="animate-bounce" />
                <div className="text-left text-sm font-medium leading-tight">
                  {totalQty > 0 ? (
                    <>
                      <p>
                        {totalQty} Item{totalQty > 1 && "s"}
                      </p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
