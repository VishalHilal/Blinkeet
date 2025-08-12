import React, { useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;
    setData(prev => ({ ...prev, image: [...prev.image, imageUrl] }));
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    data.image.splice(index, 1);
    setData({ ...data });
  };

  const handleRemoveCategory = (index) => {
    data.category.splice(index, 1);
    setData({ ...data });
  };

  const handleRemoveSubCategory = (index) => {
    data.subCategory.splice(index, 1);
    setData({ ...data });
  };

  const handleAddField = () => {
    setData(prev => ({
      ...prev,
      more_details: { ...prev.more_details, [fieldName]: "" }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleRemoveField = (key) => {
    const updated = { ...data.more_details };
    delete updated[key];
    setData(prev => ({ ...prev, more_details: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data
      });

      if (response.data.success) {
        successAlert(response.data.message);
        close && close();
        fetchProductData();
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">Update Product</h2>
        <button 
          onClick={close} 
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close form"
        >
          <IoClose size={24} className="text-gray-500" />
        </button>
      </header>

      {/* Form Content */}
      <main className="p-4 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 pb-8">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={data.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div className="space-y-4">
              <label htmlFor="productImage" className="block h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex flex-col justify-center items-center cursor-pointer hover:border-blue-400 transition-colors">
                {imageLoading ? (
                  <Loading />
                ) : (
                  <>
                    <FaCloudUploadAlt size={28} className="text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload images</p>
                  </>
                )}
                <input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </label>
              
              <div className="flex flex-wrap gap-3">
                {data.image.map((img, index) => (
                  <div key={img + index} className="relative w-20 h-20 border rounded bg-gray-50 overflow-hidden group">
                    <img
                      src={img}
                      alt=""
                      onClick={() => setViewImageURL(img)}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdDelete size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category and Subcategory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectCategory}
                onChange={(e) => {
                  const cat = allCategory.find(c => c._id === e.target.value);
                  if (cat) {
                    setData(prev => ({ ...prev, category: [...prev.category, cat] }));
                  }
                  setSelectCategory("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {allCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.category.map((c, index) => (
                  <div key={c._id} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {c.name}
                    <button 
                      type="button"
                      onClick={() => handleRemoveCategory(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SubCategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <select
                value={selectSubCategory}
                onChange={(e) => {
                  const sub = allSubCategory.find(s => s._id === e.target.value);
                  if (sub) {
                    setData(prev => ({ ...prev, subCategory: [...prev.subCategory, sub] }));
                  }
                  setSelectSubCategory("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Sub Category</option>
                {allSubCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.subCategory.map((c, index) => (
                  <div key={c._id} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {c.name}
                    <button 
                      type="button"
                      onClick={() => handleRemoveSubCategory(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {['unit', 'stock', 'price', 'discount'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input
                  name={field}
                  type={field === 'unit' ? 'text' : 'number'}
                  value={data[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          {/* More Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
            {Object.keys(data.more_details).map((key) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                  <button 
                    type="button"
                    onClick={() => handleRemoveField(key)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <IoClose size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  value={data.more_details[key]}
                  onChange={(e) =>
                    setData(prev => ({
                      ...prev,
                      more_details: { ...prev.more_details, [key]: e.target.value }
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => setOpenAddField(true)}
              className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Field
            </button>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white py-4 border-t border-gray-200 -mx-4 px-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Update Product
            </button>
          </div>
        </form>
      </main>

      {/* Modals */}
      {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </div>
  );
};

export default EditProductAdmin;