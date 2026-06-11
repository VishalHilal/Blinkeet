import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import { FiHome, FiUser, FiChevronDown } from "react-icons/fi";

const Header = ({ openCartSection }) => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const { totalPrice, totalQty } = useGlobalContext();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMobileUser = () => {
    if (!user._id) return navigate("/login");
    navigate("/user");
  };

  const UserAvatar = ({ size = "sm" }) => {
    const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
    return user.avatar ? (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${dim} rounded-full object-cover border-2 border-white ring-1 ring-gray-200 flex-shrink-0`}
      />
    ) : (
      <div
        className={`${dim} rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0`}
      >
        {user.name?.charAt(0)?.toUpperCase() || <FiUser size={14} />}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">

      {/* ══════════════════════════════════════
           MOBILE  (< lg)  —  h-16
          ══════════════════════════════════════ */}
      {!(isSearchPage && isMobile) && (
        <div className="lg:hidden h-16 flex items-center px-3 gap-2">

          {/* Logo mark (small) */}
          <Link to="/" className="shrink-0 mr-1">
            <img src={logo} alt="Blinkeet" className="h-7 w-auto" />
          </Link>

          {/* Search — takes all available space */}
          <div className="flex-1 min-w-0">
            <Search />
          </div>

          {/* User avatar / icon */}
          <button
            onClick={handleMobileUser}
            className="shrink-0 ml-1 p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="Account"
          >
            {user._id ? <UserAvatar size="sm" /> : <FiUser size={22} className="text-gray-600" />}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
           DESKTOP  (lg+)  —  h-[68px]
          ══════════════════════════════════════ */}
      <div className="hidden lg:grid h-[68px] grid-cols-[auto_1fr_auto] items-center gap-4 px-8 xl:px-14">

        {/* ── Left: Logo + Home ── */}
        <div className="flex items-center gap-1 shrink-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Blinkeet" className="h-8 w-auto" />
          </Link>
          <div className="w-px h-6 bg-gray-200 mx-3" />
          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-700 px-2.5 py-1.5 rounded-lg hover:bg-green-50 transition"
          >
            <FiHome size={16} />
            <span>Home</span>
          </button>
        </div>

        {/* ── Center: Search ── */}
        <div className="w-full max-w-xl justify-self-center">
          <Search />
        </div>

        {/* ── Right: Account + Cart ── */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* Account */}
          {user?._id ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenUserMenu((p) => !p)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition border ${
                  openUserMenu
                    ? "bg-gray-100 border-gray-200 text-gray-800"
                    : "border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                }`}
              >
                <UserAvatar size="sm" />
                <span className="hidden xl:inline max-w-[90px] truncate">
                  {user.name?.split(" ")[0]}
                </span>
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-gray-400 ${openUserMenu ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown panel */}
              {openUserMenu && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <UserMenu close={() => setOpenUserMenu(false)} />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-green-700 px-3 py-2 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-100 transition"
            >
              <FiUser size={16} />
              <span>Login</span>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => openCartSection(true)}
            className="relative flex items-center gap-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white pl-4 pr-5 py-2.5 rounded-xl transition-all shadow-sm text-sm font-semibold"
          >
            <BsCart4 size={19} />
            <span className="leading-none">
              {totalQty > 0 ? (
                <span className="flex flex-col items-start">
                  <span className="text-[11px] font-normal text-green-200 leading-none mb-0.5">
                    {totalQty} item{totalQty > 1 ? "s" : ""}
                  </span>
                  <span>{DisplayPriceInRupees(totalPrice)}</span>
                </span>
              ) : (
                "My Cart"
              )}
            </span>
            {totalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalQty > 99 ? "99+" : totalQty}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
