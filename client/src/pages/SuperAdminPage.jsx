import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiUsers, FiShoppingBag, FiShield, FiTrendingUp,
  FiChevronDown, FiSearch, FiTrash2,
} from "react-icons/fi";
import { BsFiletypeCsv, BsFiletypePdf } from "react-icons/bs";

const ROLES = ["USER", "ADMIN", "SUPERADMIN"];

/* ─── CSV helper ─────────────────────────────────────── */
function downloadCSV(filename, rows, headers) {
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows.map((r) => r.map(escape))].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─── PDF helper ─────────────────────────────────────── */
function downloadPDF(filename, title, head, body) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 22);
  autoTable(doc, {
    startY: 28, head: [head], body,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });
  doc.save(filename);
}

/* ══════════════════════════════════════════════════════ */
const SuperAdminPage = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers]         = useState([]);
  const [orders, setOrders]       = useState([]);
  const [loadingUsers, setLoadingUsers]   = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchUser, setSearchUser] = useState("");

  /* ── Fetch ── */
  const fetchUsers = async () => {
    try { setLoadingUsers(true);
      const res = await Axios({ ...SummaryApi.superadmin_getAllUsers });
      if (res.data.success) setUsers(res.data.data);
    } catch (err) { AxiosToastError(err); } finally { setLoadingUsers(false); }
  };
  const fetchOrders = async () => {
    try { setLoadingOrders(true);
      const res = await Axios({ ...SummaryApi.superadmin_getAllOrders });
      if (res.data.success) setOrders(res.data.data);
    } catch (err) { AxiosToastError(err); } finally { setLoadingOrders(false); }
  };
  useEffect(() => { fetchUsers(); fetchOrders(); }, []);

  /* ── Role change ── */
  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const res = await Axios({ ...SummaryApi.superadmin_updateRole, data: { userId, role: newRole } });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) { AxiosToastError(err); } finally { setUpdatingId(null); }
  };

  /* ── Delete user ── */
  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: "Delete user?",
      html: `<p style="font-size:14px;color:#4b5563">Permanently delete <strong>${user.name}</strong><br/><span style="color:#9ca3af">${user.email}</span><br/><br/>This removes their cart &amp; address data and <strong>cannot be undone.</strong></p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      customClass: { popup: "rounded-2xl" },
    });
    if (!result.isConfirmed) return;
    try {
      setDeletingId(user._id);
      const res = await Axios({
        ...SummaryApi.superadmin_deleteUser,
        url: `${SummaryApi.superadmin_deleteUser.url}/${user._id}`,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
      }
    } catch (err) { AxiosToastError(err); } finally { setDeletingId(null); }
  };

  /* ── Exports ── */
  const exportOrdersCSV = () => {
    downloadCSV(`orders_${Date.now()}.csv`,
      orders.map((o) => [o.orderId||"", o.userId?.name||"—", o.userId?.email||"—",
        o.product_details?.name||"—", o.totalAmt||0, o.payment_status||"Pending",
        new Date(o.createdAt).toLocaleDateString("en-IN")]),
      ["Order ID","Customer","Email","Product","Amount (₹)","Payment","Date"]);
    toast.success("CSV downloaded");
  };
  const exportOrdersPDF = () => {
    downloadPDF(`orders_${Date.now()}.pdf`, "Orders Report — Blinkeet",
      ["Order ID","Customer","Email","Product","Amount","Payment","Date"],
      orders.map((o) => [o.orderId?.slice(0,20)||"", o.userId?.name||"—",
        o.userId?.email||"—", o.product_details?.name||"—",
        `₹${(o.totalAmt||0).toLocaleString("en-IN")}`,
        o.payment_status||"Pending", new Date(o.createdAt).toLocaleDateString("en-IN")]));
    toast.success("PDF downloaded");
  };
  const exportUsersCSV = () => {
    downloadCSV(`users_${Date.now()}.csv`,
      filteredUsers.map((u) => [u.name||"", u.email||"", u.mobile||"",
        u.role||"", u.status||"", new Date(u.createdAt).toLocaleDateString("en-IN")]),
      ["Name","Email","Mobile","Role","Status","Joined"]);
    toast.success("CSV downloaded");
  };
  const exportUsersPDF = () => {
    downloadPDF(`users_${Date.now()}.pdf`, "Users Report — Blinkeet",
      ["Name","Email","Mobile","Role","Status","Joined"],
      filteredUsers.map((u) => [u.name||"", u.email||"", u.mobile||"",
        u.role||"", u.status||"", new Date(u.createdAt).toLocaleDateString("en-IN")]));
    toast.success("PDF downloaded");
  };

  /* ── Helpers ── */
  const roleBadgeClass = (role) => ({
    SUPERADMIN: "bg-purple-100 text-purple-700 border border-purple-200",
    ADMIN:      "bg-blue-100 text-blue-700 border border-blue-200",
    USER:       "bg-gray-100 text-gray-500 border border-gray-200",
  })[role] || "bg-gray-100 text-gray-500 border border-gray-200";

  const paymentBadgeClass = (s) => {
    if (!s) return "bg-gray-100 text-gray-500";
    const v = s.toLowerCase();
    if (v === "paid" || v === "succeeded") return "bg-emerald-100 text-emerald-700";
    if (v === "pending") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-600";
  };

  const filteredUsers = users.filter(
    (u) => u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
           u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const stats = [
    { label: "Users",       value: users.length,                                        icon: <FiUsers size={18} />,     color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: "Admins",      value: users.filter((u) => u.role === "ADMIN").length,      icon: <FiShield size={18} />,    color: "text-indigo-600",  bg: "bg-indigo-50"  },
    { label: "Superadmin",  value: users.filter((u) => u.role === "SUPERADMIN").length, icon: <FiShield size={18} />,    color: "text-purple-600",  bg: "bg-purple-50"  },
    { label: "Orders",      value: orders.length,                                       icon: <FiTrendingUp size={18} />,color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const Spinner = ({ color = "purple" }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
      <div className={`w-8 h-8 border-2 border-${color}-200 border-t-${color}-500 rounded-full animate-spin`} />
      <span className="text-sm">Loading…</span>
    </div>
  );

  /* Avatar component */
  const Avatar = ({ user, size = "md" }) => {
    const dim = size === "lg" ? "w-11 h-11 text-base" : "w-8 h-8 text-xs";
    return user.avatar ? (
      <img src={user.avatar} alt={user.name}
        className={`${dim} rounded-full object-cover border border-gray-200 flex-shrink-0`} />
    ) : (
      <div className={`${dim} rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0`}>
        {user.name?.charAt(0).toUpperCase()}
      </div>
    );
  };

  /* Role select */
  const RoleSelect = ({ user, fullWidth = false }) => (
    <div className={`relative inline-flex items-center ${fullWidth ? "w-full" : ""}`}>
      <select
        value={user.role}
        disabled={updatingId === user._id}
        onChange={(e) => handleRoleChange(user._id, e.target.value)}
        className={`appearance-none text-sm border border-gray-200 rounded-xl pl-3 pr-8 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:opacity-40 cursor-pointer hover:border-gray-300 transition ${fullWidth ? "w-full" : ""}`}
      >
        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      {updatingId === user._id && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-purple-300 border-t-purple-500 rounded-full animate-spin" />
      )}
    </div>
  );

  /* Export buttons */
  const ExportButtons = ({ onCSV, onPDF }) => (
    <div className="flex gap-2">
      <button onClick={onCSV}
        className="flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl text-sm font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
        <BsFiletypeCsv size={15} />
        <span>Export CSV</span>
      </button>
      <button onClick={onPDF}
        className="flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl text-sm font-medium border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 transition">
        <BsFiletypePdf size={15} />
        <span>Export PDF</span>
      </button>
    </div>
  );

  /* ════════════════════════════════════════════════════ */
  return (
    <div className="w-full space-y-4 sm:space-y-5">

      {/* ── Page title: desktop only — on mobile the tab strip already says "SA Panel" ── */}
      <div className="hidden sm:flex pb-4 border-b border-gray-100 items-center gap-2.5">
        <span className="p-1.5 bg-purple-100 rounded-xl text-purple-600"><FiShield size={18} /></span>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Superadmin Dashboard</h1>
          <p className="text-sm text-gray-400">Manage users, roles, and orders</p>
        </div>
      </div>

      {/* ── Stats: 2-col on mobile, 4-col on sm+ ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            {/* icon + label row */}
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${s.bg} ${s.color} flex-shrink-0`}>{s.icon}</div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold leading-tight">{s.label}</p>
            </div>
            {/* big number */}
            <p className={`text-4xl font-extrabold leading-none ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Data tabs: Users / Orders ── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-full sm:w-fit">
        {["Users", "Orders"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === tab ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {tab === "Users" ? <FiUsers size={14} /> : <FiShoppingBag size={14} />}
            {tab}
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === tab ? "bg-gray-100 text-gray-600" : "bg-gray-200 text-gray-500"
            }`}>
              {tab === "Users" ? users.length : orders.length}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════ USERS TAB ══════════ */}
      {activeTab === "Users" && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Toolbar: search full-width, exports below on mobile */}
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-gray-700 text-sm">All Registered Users</h2>
              {/* desktop: export inline */}
              <div className="hidden sm:block">
                <ExportButtons onCSV={exportUsersCSV} onPDF={exportUsersPDF} />
              </div>
            </div>
            {/* Search — full width */}
            <div className="relative">
              <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name or email…" value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder-gray-400" />
            </div>
            {/* mobile: export below search, full width */}
            <div className="sm:hidden">
              <ExportButtons onCSV={exportUsersCSV} onPDF={exportUsersPDF} />
            </div>
          </div>

          {loadingUsers ? <Spinner color="purple" /> : (
            <>
              {/* ── Mobile cards ── */}
              <div className="block md:hidden divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="p-4 space-y-4">

                    {/* Row 1: Avatar + name/email + status */}
                    <div className="flex items-start gap-3">
                      <Avatar user={user} size="lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-base leading-tight truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-red-400"}`} />
                        {user.status}
                      </span>
                    </div>

                    {/* Row 2: Role badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    {/* Row 3: Role dropdown full-width */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Change Role</p>
                      <RoleSelect user={user} fullWidth />
                    </div>

                    {/* Row 4: Delete (only for non-superadmin) */}
                    {user.role !== "SUPERADMIN" && (
                      <button onClick={() => handleDeleteUser(user)} disabled={deletingId === user._id}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition disabled:opacity-40">
                        {deletingId === user._id
                          ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          : <FiTrash2 size={14} />}
                        <span>Delete User</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Desktop table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      {["User", "Mobile", "Status", "Current Role", "Change Role", "Joined", ""].map((h) => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar user={user} />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 truncate max-w-[140px]">{user.name}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[160px]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                          {user.mobile || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadgeClass(user.role)}`}>{user.role}</span>
                        </td>
                        <td className="px-5 py-3.5"><RoleSelect user={user} /></td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3.5">
                          {user.role !== "SUPERADMIN" ? (
                            <button onClick={() => handleDeleteUser(user)} disabled={deletingId === user._id}
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40">
                              {deletingId === user._id
                                ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                : <FiTrash2 size={15} />}
                            </button>
                          ) : <span className="w-9 inline-block" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                  <FiUsers size={28} className="mb-2 opacity-30" />
                  <p className="text-sm">{searchUser ? "No users match your search" : "No users found"}</p>
                </div>
              )}
            </>
          )}

          {!loadingUsers && filteredUsers.length > 0 && (
            <div className="px-4 sm:px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </div>
      )}

      {/* ══════════ ORDERS TAB ══════════ */}
      {activeTab === "Orders" && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 text-sm">All Orders</h2>
              <div className="hidden sm:block">
                <ExportButtons onCSV={exportOrdersCSV} onPDF={exportOrdersPDF} />
              </div>
            </div>
            <div className="sm:hidden">
              <ExportButtons onCSV={exportOrdersCSV} onPDF={exportOrdersPDF} />
            </div>
          </div>

          {loadingOrders ? <Spinner color="emerald" /> : (
            <>
              {/* ── Mobile cards ── */}
              <div className="block md:hidden divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order._id} className="p-4 space-y-3">
                    {/* Order ID + date */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                        #{order.orderId?.slice(0, 14)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    {/* Product */}
                    <div className="flex items-center gap-3">
                      {order.product_details?.image?.[0] && (
                        <img src={order.product_details.image[0]} alt=""
                          className="w-11 h-11 object-contain rounded-xl border border-gray-100 flex-shrink-0 bg-gray-50" />
                      )}
                      <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                        {order.product_details?.name || "—"}
                      </p>
                    </div>
                    {/* Customer */}
                    {order.userId && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] font-bold flex-shrink-0">
                          {order.userId.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{order.userId.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{order.userId.email}</p>
                        </div>
                      </div>
                    )}
                    {/* Amount + payment */}
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-extrabold text-gray-900">₹{order.totalAmt?.toLocaleString("en-IN")}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadgeClass(order.payment_status)}`}>
                        {order.payment_status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Desktop table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      {["Order ID","Customer","Product","Amount","Payment","Date"].map((h) => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{order.orderId?.slice(0,14)}…</span>
                        </td>
                        <td className="px-5 py-3.5">
                          {order.userId ? (
                            <div>
                              <p className="font-medium text-gray-800 truncate max-w-[120px]">{order.userId.name}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[150px]">{order.userId.email}</p>
                            </div>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {order.product_details?.image?.[0] && (
                              <img src={order.product_details.image[0]} alt="" className="w-8 h-8 object-contain rounded-lg border border-gray-100 flex-shrink-0" />
                            )}
                            <span className="text-gray-700 truncate max-w-[130px] text-xs">{order.product_details?.name || "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-800 whitespace-nowrap">₹{order.totalAmt?.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentBadgeClass(order.payment_status)}`}>
                            {order.payment_status || "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                  <FiShoppingBag size={28} className="mb-2 opacity-30" />
                  <p className="text-sm">No orders found</p>
                </div>
              )}
            </>
          )}

          {!loadingOrders && orders.length > 0 && (
            <div className="px-4 sm:px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {orders.length} orders
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuperAdminPage;
