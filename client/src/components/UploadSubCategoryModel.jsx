import React, { useState, useEffect } from 'react'
import { IoClose } from "react-icons/io5"
import uploadImage from '../utils/UploadImage'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const getLastSelectedCategory = () => {
    const savedCategory = localStorage.getItem('lastSelectedCategory')
    return savedCategory ? JSON.parse(savedCategory) : null
  }

  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  })

  const [lastSelectedCategoryId, setLastSelectedCategoryId] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)

  useEffect(() => {
    const lastCategory = getLastSelectedCategory()
    if (lastCategory) {
      const categoryDetails = allCategory.find(el => el._id === lastCategory._id)
      if (categoryDetails) {
        setSubCategoryData(prev => ({
          ...prev,
          category: [categoryDetails]
        }))
        setLastSelectedCategoryId(lastCategory._id)
      }
    }
  }, [allCategory])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSubCategoryData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategorySelect = (categoryId) => {
    const categoryDetails = allCategory.find(el => el._id === categoryId)
    if (categoryDetails) {
      localStorage.setItem('lastSelectedCategory', JSON.stringify(categoryDetails))
      setLastSelectedCategoryId(categoryId)
      setSubCategoryData(prev => ({ ...prev, category: [categoryDetails] }))
    }
  }

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const displayName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/&/g, ',')
        .trim()

      setSubCategoryData(prev => ({
        ...prev,
        name: displayName
      }))

      const response = await uploadImage(file, displayName)

      let imageUrl =
        response?.data?.data?.url ||
        response?.data?.url ||
        response?.data?.data?.secure_url ||
        response?.data?.secure_url

      if (!imageUrl) throw new Error('Failed to get image URL from upload response')

      setSubCategoryData(prev => ({
        ...prev,
        image: imageUrl
      }))

      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error?.response?.data?.message || error.message || 'Failed to upload image')
      setSubCategoryData(prev => ({ ...prev, image: '' }))
    }
  }

  const handleRemoveCategorySelected = (categoryId) => {
    const index = subCategoryData.category.findIndex(el => el._id === categoryId)
    subCategoryData.category.splice(index, 1)
    setSubCategoryData(prev => ({ ...prev }))
  }

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData
      })

      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        if (close) close()
        if (fetchData) fetchData()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
        <div className='flex justify-between items-center border-b pb-3'>
          <h2 className='text-lg font-semibold text-gray-800'>Add Sub Category</h2>
          <button onClick={close} className='text-gray-500 hover:text-red-500'>
            <IoClose size={24} />
          </button>
        </div>

        <form className='grid gap-6 mt-4' onSubmit={handleSubmitSubCategory}>
          {/* Name Field */}
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
              Name
            </label>
            <input
              id='name'
              name='name'
              value={subCategoryData.name}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 bg-blue-50'
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
            <div className='flex flex-col lg:flex-row items-center gap-4'>
              <div className='w-full lg:w-36 h-36 border rounded-lg bg-blue-50 flex items-center justify-center'>
                {!subCategoryData.image ? (
                  <p className='text-gray-400 text-sm'>No Image</p>
                ) : (
                  <img
                    alt='subcategory'
                    src={subCategoryData.image}
                    className='w-full h-full object-contain rounded'
                  />
                )}
              </div>
              <label htmlFor='uploadSubCategoryImage' className='cursor-pointer'>
                <div className='px-4 py-2 bg-primary-100 text-white font-medium rounded-md hover:bg-primary-200 transition'>
                  Upload Image
                </div>
                <input
                  type='file'
                  id='uploadSubCategoryImage'
                  className='hidden'
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Select Category
            </label>
            <div className='border border-gray-300 rounded-lg'>
              <div className='flex flex-wrap gap-2 p-2'>
                {subCategoryData.category.map(cat => (
                  <div key={cat._id + "selectedValue"} className='bg-gray-100 px-2 py-1 rounded flex items-center gap-1'>
                    <span>{cat.name}</span>
                    <button type='button' onClick={() => handleRemoveCategorySelected(cat._id)} className='text-red-500 hover:text-red-700'>
                      <IoClose size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <select
                className='w-full p-2 border-t border-gray-200 rounded-b-lg focus:outline-none'
                value={lastSelectedCategoryId}
                onChange={(e) => handleCategorySelect(e.target.value)}
              >
                <option value=''>Select Category</option>
                {allCategory.map(category => (
                  <option value={category?._id} key={category._id + "subcategory"}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type='submit'
            className={`w-full py-3 rounded-lg font-semibold transition ${
              subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0]
                ? 'bg-primary-200 text-white hover:bg-primary-100'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  )
}

export default UploadSubCategoryModel
