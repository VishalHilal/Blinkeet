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
    <div className="mb-8">
      {/* Section Header */}
      <div className=" mx-auto px-4 flex items-center justify-between mb-4">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{name}</h3>
        <Link to={redirectURL} className="text-sm font-medium text-green-600 hover:text-green-500">
          See All
        </Link>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 md:gap-6 lg:gap-8 overflow-x-auto scroll-hidden-smooth scrollbar-none px-4"
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

        {/* Scroll Buttons - visible only on large screens */}
        <div className="hidden lg:flex justify-between items-center px-4 absolute top-1/2 left-0 right-0 transform -translate-y-1/2 pointer-events-none">
          <button
            onClick={handleScrollLeft}
            className="pointer-events-auto bg-white shadow-md hover:bg-gray-100 text-gray-700 p-3 rounded-full transition"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="pointer-events-auto bg-white shadow-md hover:bg-gray-100 text-gray-700 p-3 rounded-full transition"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
