import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5"

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search
        }
      })

      const { data: responseData } = response

      console.log("admin page data",  responseData);

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [page])

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {
    let flag = true

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData()
        flag = false
      }
    }, 300)

    return () => clearTimeout(interval)
  }, [search])

  return (
    <section className="w-full">
      {/* Top Bar */}
      <div className="p-4 bg-white lg:mt-28 sm:mt-12 shadow-sm border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="hidden lg:block text-xl font-semibold text-gray-800">Manage Products</h2>
        <div className="flex items-center mt-10 lg:mt-0 gap-2 bg-gray-100 px-3 py-2 rounded-md w-full sm:w-72 border border-gray-300 focus-within:ring-2 ring-green-500">
          <IoSearchOutline size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search product..."
            className="w-full bg-transparent outline-none text-sm"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {/* Loader */}
      {loading && <Loading />}

      {/* Products Section */}
      <div className="p-4 flex flex-col gap-4 min-h-[calc(100vh-150px)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {productData.map((p, index) => (
            <ProductCardAdmin key={p._id || index} data={p} fetchProductData={fetchProductData} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 sm:px-8 shadow z-50">
          <button
            onClick={handlePrevious}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition text-sm font-medium"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-700 text-center">
            Page {page} of {totalPageCount}
          </span>

          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductAdmin
