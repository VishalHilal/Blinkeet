import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.addCategory, data });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const displayName = file.name.replace(/\.[^/.]+$/, "").trim();
      setData((prev) => ({ ...prev, name: displayName }));
      setLoading(true);
      const response = await uploadImage(file, displayName);
      let imageUrl = response?.data?.data?.url || response?.data?.url || response?.data?.data?.secure_url || response?.data?.secure_url;
      if (!imageUrl) throw new Error('Failed to get image URL from upload response');
      setData((prev) => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to upload image');
      setData((prev) => ({ ...prev, image: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 p-4 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add New Category</h2>
          <button onClick={close} className="text-gray-600 hover:text-red-500 transition">
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="categoryName"
              name="name"
              type="text"
              value={data.name}
              onChange={handleOnChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Image</p>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="w-full lg:w-36 h-36 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden">
                {data.image ? (
                  <img src={data.image} alt="category" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm text-gray-400">No Image</span>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition 
                  ${loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "hover:bg-blue-100 border-blue-400 text-blue-600"}`}>
                  {loading ? "Uploading..." : "Upload Image"}
                </div>
                <input
                  id="uploadCategoryImage"
                  type="file"
                  accept="image/*"
                  disabled={loading}
                  onChange={handleUploadCategoryImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!data.image}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition 
              ${data.image ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          >
            Add Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
