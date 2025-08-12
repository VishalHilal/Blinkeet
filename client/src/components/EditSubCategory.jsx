import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditSubCategory = ({ close, data, fetchData }) => {
    const [subCategoryData, setSubCategoryData] = useState({
        _id: data._id,
        name: data.name,
        image: data.image,
        category: data.category || []
    })
    const allCategory = useSelector(state => state.product.allCategory)

    const handleChange = (e) => {
        const { name, value } = e.target

        setSubCategoryData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const response = await uploadImage(file)
        const { data: ImageResponse } = response

        setSubCategoryData(prev => ({
            ...prev,
            image: ImageResponse.data.url
        }))
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
                ...SummaryApi.updateSubCategory,
                data: subCategoryData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close?.()
                fetchData?.()
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-neutral-800">Edit Sub Category</h2>
                    <button onClick={close} className="text-neutral-600 hover:text-red-500">
                        <IoClose size={26} />
                    </button>
                </div>

                <form onSubmit={handleSubmitSubCategory} className="mt-6 space-y-5">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-sm font-medium text-neutral-700">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            placeholder="Enter sub-category name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Image</label>
                        <div className="flex flex-col lg:flex-row items-center gap-4">
                            <div className="w-full lg:w-36 h-36 bg-gray-100 rounded-xl flex items-center justify-center border">
                                {subCategoryData.image ? (
                                    <img
                                        src={subCategoryData.image}
                                        alt="subCategory"
                                        className="w-full h-full object-contain rounded-xl"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-400">No Image</p>
                                )}
                            </div>

                            <label htmlFor="uploadSubCategoryImage" className="cursor-pointer">
                                <div className="px-4 py-2 rounded-xl border border-primary-200 text-primary-600 hover:bg-primary-200 hover:text-white transition">
                                    Upload Image
                                </div>
                                <input
                                    type="file"
                                    id="uploadSubCategoryImage"
                                    onChange={handleUploadSubCategoryImage}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Select Category</label>
                        <div className="border rounded-xl p-2 bg-gray-50">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {subCategoryData.category.map(cat => (
                                    <div key={cat._id + "selectedValue"} className="bg-white px-2 py-1 flex items-center gap-2 shadow rounded-md">
                                        <span>{cat.name}</span>
                                        <IoClose
                                            size={18}
                                            onClick={() => handleRemoveCategorySelected(cat._id)}
                                            className="text-red-500 cursor-pointer hover:scale-110 transition"
                                        />
                                    </div>
                                ))}
                            </div>
                            <select
                                className="w-full p-2 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-primary-200"
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id === value)
                                    if (categoryDetails) {
                                        setSubCategoryData(prev => ({
                                            ...prev,
                                            category: [...prev.category, categoryDetails]
                                        }))
                                    }
                                }}
                            >
                                <option value={""}>Select Category</option>
                                {allCategory.map(category => (
                                    <option key={category._id + "subcategory"} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-semibold transition duration-200 ${subCategoryData.name && subCategoryData.image && subCategoryData.category.length > 0
                            ? "bg-primary-200 text-white hover:bg-primary-100"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                        disabled={!(subCategoryData.name && subCategoryData.image && subCategoryData.category.length > 0)}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditSubCategory
