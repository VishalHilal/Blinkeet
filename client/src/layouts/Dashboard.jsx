import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import isAdmin from "../utils/isAdmin";
import UserMenu from "../components/UserMenu";
import {
  FiUser, FiShoppingBag, FiMapPin,
  FiGrid, FiLayers, FiUploadCloud, FiPackage,
  FiShield, FiMenu, FiX,
} from "react-icons/fi";

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await Axios({ ...SummaryApi.logout });
      if (res.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) { AxiosToastError(err); }
  };

  const roleBg = {
    SUPERADMIN: "bg-purple-100 text-purple-700",
    ADMIN:      "bg-blue-100 text-blue-700",
    USER:       "bg-gray-100 text-gray-500",
  };

  /* tabs always shown in the mobile strip */
  const coreTabs = [
    { to: "/dashboard/profile",  icon: <FiUser size={19} />,     label: "Profile"  },
    { to: "/dashboard/myorders", icon: <FiShoppingBag size={19} />, label: "Orders" },
    { to: "/dashboard/address",  icon: <FiMapPin size={19} />,    label: "Address"  },
  ];
  const adminTabs = isAdmin(user.role) ? [
    { to: "/dashboard/category",        icon: <FiGrid size={19} />,       label: "Category" },
    { to: "/dashboard/subcategory",     icon: <FiLayers size={19} />,     label: "Sub Cat"  },
    { to: "/dashboard/upload-product",  icon: <FiUploadCloud size={19} />,label: "Upload"   },
    { to: "/dashboard/product",         icon: <FiPackage size={19} />,    label: "Products" },
  ] : [];
  const saTabs = user.role === "SUPERADMIN"
    ? [{ to: "/dashboard/superadmin", icon: <FiShield size={19} />, label: "SA Panel" }]
    : [];

  const allTabs = [...saTabs, ...adminTabs, ...coreTabs];

  const MobileTab = ({ to, icon, label, activeColor = "text-green-600", activeBorder = "border-green-500" }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-shrink-0 flex flex-col items-center justify-center gap-0.5 px-4 min-h-[44px] py-2 text-[11px] font-medium border-b-2 transition-all ${
          isActive ? `${activeBorder} ${activeColor}` : "border-transparent text-gray-400"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* ════════════════════════════
           MOBILE  (< lg)
          ════════════════════════════ */}
      <div className="lg:hidden min-h-screen bg-gray-50 flex flex-col">

        {/* Sub-header bar — tab strip only, no redundant user row */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
          {/* Scrollable tab strip with 44px min touch height */}
          <div className="flex overflow-x-auto scrollbar-hide">
            {allTabs.map(({ to, icon, label }) => (
              <MobileTab key={to} to={to} icon={icon} label={label}
                activeColor={to.includes("superadmin") ? "text-purple-600" : "text-green-600"}
                activeBorder={to.includes("superadmin") ? "border-purple-500" : "border-green-500"}
              />
            ))}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 min-h-[60vh]">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative z-10 w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">Menu</p>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition">
                <FiX size={19} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <UserMenu close={() => setDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════
           DESKTOP  (lg+)
          ════════════════════════════ */}
      <div className="hidden lg:flex min-h-[calc(100vh-68px)] bg-gray-50">

        {/* ── Sidebar: fixed-position, full height from below header ── */}
        <aside className="w-[260px] shrink-0 sticky top-[68px] h-[calc(100vh-68px)] bg-white border-r border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <UserMenu />
        </aside>

        {/* ── Content area ── */}
        <div className="flex-1 flex flex-col p-6 min-w-0">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
