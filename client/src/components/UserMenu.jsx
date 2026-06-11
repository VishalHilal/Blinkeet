import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import isAdmin from "../utils/isAdmin";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiGrid,
  FiLayers,
  FiUploadCloud,
  FiPackage,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

// nav item definition
const navItem = (to, icon, label, end = false) => ({ to, icon, label, end });

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await Axios({ ...SummaryApi.logout });
      if (res.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      AxiosToastError(err);
    }
  };

  const handleClose = () => { if (close) close(); };

  // role-based link groups
  const userLinks = [
    navItem("/dashboard/profile", <FiUser size={16} />, "Profile"),
    navItem("/dashboard/myorders", <FiShoppingBag size={16} />, "My Orders"),
    navItem("/dashboard/address", <FiMapPin size={16} />, "Saved Address"),
  ];

  const adminLinks = isAdmin(user.role)
    ? [
        navItem("/dashboard/category", <FiGrid size={16} />, "Category"),
        navItem("/dashboard/subcategory", <FiLayers size={16} />, "Sub Category"),
        navItem("/dashboard/upload-product", <FiUploadCloud size={16} />, "Upload Product"),
        navItem("/dashboard/product", <FiPackage size={16} />, "Products"),
      ]
    : [];

  const superAdminLinks =
    user.role === "SUPERADMIN"
      ? [navItem("/dashboard/superadmin", <FiShield size={16} />, "Superadmin Panel")]
      : [];

  const roleBg = {
    SUPERADMIN: "bg-purple-100 text-purple-700",
    ADMIN: "bg-blue-100 text-blue-700",
    USER: "bg-gray-100 text-gray-500",
  };

  const LinkGroup = ({ title, links }) => (
    <div className="mb-1">
      {title && (
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {title}
        </p>
      )}
      {links.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={handleClose}
          className={({ isActive }) =>
            `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-green-50 text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <span className="flex-shrink-0">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── User card ── */}
      <div className="px-4 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-green-100 flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            {user.role && (
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  roleBg[user.role] || roleBg.USER
                }`}
              >
                {user.role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto py-2 min-h-0">
        {superAdminLinks.length > 0 && (
          <LinkGroup title="Superadmin" links={superAdminLinks} />
        )}
        {adminLinks.length > 0 && (
          <LinkGroup title="Admin" links={adminLinks} />
        )}
        <LinkGroup title="Account" links={userLinks} />
      </nav>

      {/* ── Logout ── */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          <FiLogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
