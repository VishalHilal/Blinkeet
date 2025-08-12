import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { setAllCategory, setAllSubCategory } from '../store/productSlice'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryList = () => {
  const dispatch = useDispatch()
  const { allCategory, allSubCategory } = useSelector(state => state.product)

  const fetchCategories = async () => {
    try {
      const [categoryResponse, subCategoryResponse] = await Promise.all([
        Axios(SummaryApi.getCategory),
        Axios(SummaryApi.getSubCategory)
      ])

      if (categoryResponse.data.success) {
        dispatch(setAllCategory(categoryResponse.data.data))
      }
      if (subCategoryResponse.data.success) {
        dispatch(setAllSubCategory(subCategoryResponse.data.data))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className=" mx-auto px-4 py-6 ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse Categories</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {allCategory.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all p-5"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-14 h-14 object-contain rounded"
              />
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Subcategories</h4>
              <div className="grid grid-cols-2 gap-3">
                {allSubCategory
                  .filter(sub => sub.category.some(cat => cat._id === category._id))
                  .map(sub => (
                    <Link
                      key={sub._id}
                      to={`/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(sub.name)}-${sub._id}`}
                      className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700 transition"
                    >
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span>{sub.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList
