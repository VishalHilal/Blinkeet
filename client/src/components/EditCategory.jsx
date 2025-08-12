import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
  const [data, setData] = useState({
    _id: CategoryData._id,
    name: CategoryData.name,
    image: CategoryData.image
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateCategory,
        data: data
      });
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

    setLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    setLoading(false);

    setData((prev) => ({
      ...prev,
      image: ImageResponse.data.url
    }));
  };

  return (
    <section className='fixed inset-0 p-4 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white w-full max-w-2xl p-6 rounded-xl shadow-xl'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Update Category</h2>
          <button onClick={close} className='text-gray-500 hover:text-red-500 transition'>
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='grid gap-5'>
          <div className='grid gap-1'>
            <label htmlFor='categoryName' className='text-sm font-medium text-gray-700'>Name</label>
            <input
              type='text'
              id='categoryName'
              name='name'
              placeholder='Enter category name'
              value={data.name}
              onChange={handleOnChange}
              className='bg-blue-50 border border-blue-200 p-3 rounded-md outline-none focus:ring-2 focus:ring-primary-200 transition'
            />
          </div>

          <div className='grid gap-2'>
            <label className='text-sm font-medium text-gray-700'>Image</label>
            <div className='flex flex-col lg:flex-row items-center gap-4'>
              <div className='w-full lg:w-36 h-36 bg-blue-50 border rounded-md flex items-center justify-center overflow-hidden'>
                {data.image ? (
                  <img
                    src={data.image}
                    alt='category'
                    className='object-contain w-full h-full'
                  />
                ) : (
                  <p className='text-sm text-gray-400'>No Image</p>
                )}
              </div>
              <label htmlFor='uploadCategoryImage'>
                <div className={`
                  px-4 py-2 rounded-md border text-sm font-medium cursor-pointer transition 
                  ${!data.name ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-100 hover:bg-primary-200 border-primary-200'}
                `}>
                  {loading ? "Uploading..." : "Upload Image"}
                </div>
                <input
                  type='file'
                  id='uploadCategoryImage'
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  className='hidden'
                />
              </label>
            </div>
          </div>

          <button
            type='submit'
            disabled={!data.name || !data.image}
            className={`
              w-full py-3 rounded-md text-white font-semibold transition 
              ${data.name && data.image ? 'bg-primary-200 hover:bg-primary-100' : 'bg-gray-300 cursor-not-allowed'}
            `}
          >
            Update Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
