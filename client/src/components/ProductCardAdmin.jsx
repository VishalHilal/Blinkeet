import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchProductData) fetchProductData();
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <>
      <div className="w-full sm:max-w-[180px] bg-white rounded-2xl shadow group hover:shadow-lg transition-all duration-300 border border-gray-200 p-3 flex flex-col justify-between">
        {/* Product Image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={data?.image[0]}
            alt={data?.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="mt-3 flex flex-col flex-1">
          <p className="text-sm font-semibold text-gray-800 line-clamp-2">{data?.name}</p>
          <span className="text-xs text-gray-500 mt-0.5">{data?.unit}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => setEditOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-green-500 text-green-600 bg-green-50 hover:bg-green-100 transition"
          >
            Edit
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-500 text-red-600 bg-red-50 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit Form Overlay */}
      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {openDelete && (
        <section className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Delete Product</h3>
              <button onClick={() => setOpenDelete(false)} className="text-gray-500 hover:text-gray-800">
                <IoClose size={22} />
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete this product permanently?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductCardAdmin;
