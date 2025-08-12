import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  return (
    <div className="rounded-lg  bg-card bg-gray-100 shadow-2xl text-card-foreground shadow-sm w-[330px] overflow-hidden border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col mt-12 h-full justify-between">
        <div>
          <div className="px-5 text-sm text-gray-800">
            <div className="flex items-center justify-between gap-2 text-gray-600 dark:text-gray-300">
              <span className="max-w-[12rem] truncate">
                <div className="text-xl bg-white h-12 w-40 flex items-center justify-center text-black hover:bg-black hover:text-white rounded ">
                  {user.name.toUpperCase() || user.mobile}
                </div>
                {user.role === "ADMIN" && (
                  <div className="inline-flex items-center rounded-full border font-semibold w-max px-2 py-0.5 text-xs text-zinc-950 dark:border-none dark:bg-zinc-800 dark:text-white">
                    {user.role === "ADMIN" ? "ADMIN" : "USER"}
                  </div>
                )}
              </span>
              <Link
                onClick={handleClose}
                to="/dashboard/profile"
                className="text-primary-200 hover:text-primary-100 transition"
              >
                <HiOutlineExternalLink size={24} />
              </Link>
            </div>
          </div>

          <div className="my-4">
            <Divider />
          </div>

          <ul className="flex flex-col">
            {isAdmin(user.role) && (
              <li>
                <Link
                  onClick={handleClose}
                  to="/dashboard/category"
                  className="flex w-full text-black items-center justify-between rounded-lg py-3 pl-8 hover:text-white dark:hover:bg-green-600 transition"
                >
                  Category
                </Link>
              </li>
            )}

            {isAdmin(user.role) && (
              <li>
                <Link
                  onClick={handleClose}
                  to="/dashboard/subcategory"
                  className="flex w-full items-center text-black justify-between rounded-lg py-3 pl-8 hover:text-white dark:hover:bg-green-600 transition"
                >
                  Sub Category
                </Link>
              </li>
            )}

            {isAdmin(user.role) && (
              <li>
                <Link
                  onClick={handleClose}
                  to="/dashboard/upload-product"
                  className="flex w-full items-center text-black justify-between rounded-lg py-3 pl-8 hover:text-white dark:hover:bg-green-600 transition"
                >
                  Upload Product
                </Link>
              </li>
            )}

            {isAdmin(user.role) && (
              <li>
                <Link
                  onClick={handleClose}
                  to="/dashboard/product"
                  className="flex w-full items-center text-black justify-between rounded-lg py-3 pl-8 hover:text-white dark:hover:bg-green-600 transition"
                >
                  Product
                </Link>
              </li>
            )}

            <li>
              <Link
                onClick={handleClose}
                to="/dashboard/myorders"
                className="flex w-full items-center text-black justify-between rounded-lg py-3 pl-8 hover:text-white dark:hover:bg-green-600 transition"
              >
                My Orders
              </Link>
            </li>

            <li>
              <Link
                onClick={handleClose}
                to="/dashboard/address"
                className="flex w-full items-center text-black justify-between rounded-lg py-3 pl-8 hover:text-white dark:hover:bg-green-600 transition"
              >
                Save Address
              </Link>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center text-black justify-between rounded-lg py-3 pl-8 text-red-600 hover:text-white dark:hover:bg-red-600 transition text-left"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
