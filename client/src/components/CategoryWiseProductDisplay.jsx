import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef()
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const loadingCardNumber = new Array(6).fill(null)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id }
      })

      if (response.data.success) {
        setData(response.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryWiseProduct()
  }, [])

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 300
  }

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 300
  }

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    )
    return `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`
  }

  const redirectURL = handleRedirectProductListpage()

  return (
    <div className="mb-6 sm:mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-4 max-w-7xl mx-auto">
        <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">{name}</h3>
        <Link
          to={redirectURL}
          className="text-xs sm:text-sm font-semibold text-green-600 hover:text-green-500 transition"
        >
          See All
        </Link>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scroll-hidden-smooth scrollbar-none px-4"
        >
          {loading
            ? loadingCardNumber.map((_, index) => (
                <CardLoading key={"CategorywiseProductDisplay123" + index} />
              ))
            : data.map((p, index) => (
                <CardProduct
                  data={p}
                  key={p._id + "CategorywiseProductDisplay" + index}
                />
              ))}
        </div>

        {/* Scroll Buttons — desktop only */}
        <div className="hidden lg:flex justify-between items-center px-4 absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
          <button
            onClick={handleScrollLeft}
            className="pointer-events-auto bg-white shadow-md hover:bg-gray-50 text-gray-700 p-2.5 rounded-full transition border border-gray-100"
          >
            <FaAngleLeft size={14} />
          </button>
          <button
            onClick={handleScrollRight}
            className="pointer-events-auto bg-white shadow-md hover:bg-gray-50 text-gray-700 p-2.5 rounded-full transition border border-gray-100"
          >
            <FaAngleRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
