import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const Product = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)

  const fetchProductData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setProductData(responseData.data)
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Products</h2>

      {productData.length === 0 ? (
        <div className="text-center text-gray-600">No products found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productData.map((product, index) => (
            <div key={product._id || index} className="bg-white shadow-md border rounded-xl p-4 hover:shadow-lg transition">
              <img
                src={product.image?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              <p className="text-green-700 font-bold mt-2">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Product
