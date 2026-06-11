import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import {
  FiUsers,
  FiShoppingBag,
  FiShield,
  FiTrendingUp,
  FiChevronDown,
} from "react-icons/fi";

const ROLES = ["USER", "ADMIN", "SUPERADMIN"];

const SuperAdminPage = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchUser, setSearchUser] = useState("");

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await Axios({ ...SummaryApi.superadmin_getAllUsers });
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await Axios({ ...SummaryApi.superadmin_getAllOrders });
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const res = await Axios({
        ...SummaryApi.superadmin_updateRole,
        data: { userId, role: newRole },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const roleBadgeClass = (role) => {
    const map = {
      SUPERADMIN: "bg-purple-100 text-purple-700 border border-purple-200",
      ADMIN: "bg-blue-100 text-blue-700 border border-blue-200",
      USER: "bg-gray-100 text-gray-500 border border-gray-200",
    };
    return map[role] || map.USER;
  };

  const paymentBadgeClass = (status) => {
    if (!status) return "bg-gray-100 text-gray-500";
    const s = status.toLowerCase();
    if (s === "paid" || s === "succeeded") return "bg-emerald-100 text-emerald-700";
    if (s === "pending") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-600";
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <FiUsers size={18} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "ADMIN").length,
      icon: <FiShield size={18} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Superadmins",
      value: users.filter((u) => u.role === "SUPERADMIN").length,
      icon: <FiShield size={18} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: <FiTrendingUp size={18} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <span className="p-2 bg-purple-100 rounded-xl text-purple-600">
            <FiShield size={20} />
          </span>
          <h1 className="text-xl font-bold text-gray-800">
            Superadmin Dashboard
          </h1>
        </div>
        <p className="text-sm text-gray-400 ml-11">
          Manage all users, roles, and orders across the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-2.5 rounded-xl ${s.bg} ${s.color} flex-shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">
                {s.label}
              </p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
        {["Users", "Orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "Users" ? <FiUsers size={14} /> : <FiShoppingBag size={14} />}
            {tab}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab
                  ? "bg-gray-100 text-gray-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {tab === "Users" ? users.length : orders.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Users Tab ── */}
      {activeTab === "Users" && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-semibold text-gray-700 text-sm">
              All Registered Users
            </h2>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full sm:w-64 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder-gray-400"
            />
          </div>

          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-sm">Loading users…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {["User", "Mobile", "Status", "Current Role", "Change Role", "Joined"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate max-w-[130px]">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[160px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {user.mobile || <span className="text-gray-300">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>

                      {/* Current Role */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadgeClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Change Role */}
                      <td className="px-5 py-3.5">
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            disabled={updatingId === user._id}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            className="appearance-none text-xs border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:opacity-40 cursor-pointer hover:border-gray-300 transition"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown
                            size={12}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                          {updatingId === user._id && (
                            <span className="ml-2 text-xs text-purple-400">
                              Saving…
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <FiUsers size={32} className="mb-2 opacity-30" />
                  <p className="text-sm">
                    {searchUser ? "No users match your search" : "No users found"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer count */}
          {!loadingUsers && filteredUsers.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </div>
      )}

      {/* ── Orders Tab ── */}
      {activeTab === "Orders" && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm">All Orders</h2>
          </div>

          {loadingOrders ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-sm">Loading orders…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {["Order ID", "Customer", "Product", "Amount", "Payment", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {order.orderId?.slice(0, 14)}…
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        {order.userId ? (
                          <div>
                            <p className="font-medium text-gray-800 truncate max-w-[120px]">
                              {order.userId.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">
                              {order.userId.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {order.product_details?.image?.[0] && (
                            <img
                              src={order.product_details.image[0]}
                              alt=""
                              className="w-8 h-8 object-contain rounded-lg border border-gray-100 flex-shrink-0"
                            />
                          )}
                          <span className="text-gray-700 truncate max-w-[130px] text-xs">
                            {order.product_details?.name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                        ₹{order.totalAmt?.toLocaleString("en-IN")}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentBadgeClass(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status || "Pending"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <FiShoppingBag size={32} className="mb-2 opacity-30" />
                  <p className="text-sm">No orders found</p>
                </div>
              )}
            </div>
          )}

          {!loadingOrders && orders.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {orders.length} orders
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
