import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import { FiArrowLeft } from "react-icons/fi";

const UserMenuMobile = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-gray-800">Account</h1>
      </div>

      {/* Menu — pass no-op close so NavLink navigation isn't cancelled by navigate(-1) */}
      <div className="flex-1 overflow-y-auto">
        <UserMenu close={null} />
      </div>
    </section>
  );
};

export default UserMenuMobile;
