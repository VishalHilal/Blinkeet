import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import toast from 'react-hot-toast'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, fromHome: true },
      '',
      location.pathname
    );

    const handlePopState = (event) => {
      if (event.state?.fromHome) {
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, navigate]);

  const getCategoryAndSubCategoryIds = () => {
    try {
      if (!params.category || !params.subCategory) {
        throw new Error('Missing category or subcategory in URL')
      }

      const categoryParts = params.category.split("-")
      const subCategoryParts = params.subCategory.split("-")

      if (categoryParts.length < 2 || subCategoryParts.length < 2) {
        throw new Error('Invalid URL format')
      }

      const categoryId = categoryParts[categoryParts.length - 1]
      const subCategoryId = subCategoryParts[subCategoryParts.length - 1]

      const categoryExists = AllSubCategory.some(sub =>
        sub.category.some(cat => cat._id === categoryId)
      )
      const subCategoryExists = AllSubCategory.some(sub =>
        sub._id === subCategoryId && sub.category.some(cat => cat._id === categoryId)
      )

      if (!categoryExists || !subCategoryExists) {
        throw new Error('Category or subcategory not found')
      }

      return { categoryId, subCategoryId }
    } catch (error) {
      console.error('Error parsing URL parameters:', error)
      toast.error(error.message || 'Invalid category or subcategory')
      setShouldRedirect(true)
      return { categoryId: null, subCategoryId: null }
    }
  }

  const { categoryId, subCategoryId } = getCategoryAndSubCategoryIds()
  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const fetchProductdata = async () => {
    if (!categoryId || !subCategoryId) return

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: [categoryId],
          subCategoryId: [subCategoryId],
          page,
          limit: 8,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(prev => page === 1 ? responseData.data : [...prev, ...responseData.data])
        setTotalPage(responseData.totalCount)
      } else {
        toast.error(responseData.message || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch products')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (categoryId && subCategoryId) {
      fetchProductdata()
    }
  }, [params, page])

  useEffect(() => {
    if (categoryId) {
      const sub = AllSubCategory.filter(s =>
        s.category.some(el => el._id === categoryId)
      )
      setDisplaySubCategory(sub)
    }
  }, [params, AllSubCategory, categoryId])

  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[260px,1fr] gap-4 px-2'>
        {/* Sidebar - Subcategories */}
        <div className='min-h-[88vh] mt-20 lg:mt-36 max-h-[88vh] overflow-y-scroll rounded-lg shadow border bg-white py-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent'>
          {DisplaySubCatory.map((subCategory) => {
            const link = `/${valideURLConvert(subCategory?.category[0]?.name)}-${subCategory?.category[0]?._id}/${valideURLConvert(subCategory.name)}-${subCategory._id}`
            return (
              <Link
                key={`subcategory-${subCategory._id}`}
                to={link}
                className={`flex lg:flex-row flex-col items-center gap-2 lg:gap-4 px-3 py-2 hover:bg-green-100 transition rounded-lg cursor-pointer border-b
                  ${subCategoryId === subCategory._id ? "bg-green-100" : ""}
                `}
              >
                <img
                  src={subCategory.image}
                  alt={subCategory.name}
                  className='w-12 h-12 object-contain'
                />
                <p className='text-xs text-center lg:text-left lg:text-sm font-medium'>{subCategory.name}</p>
              </Link>
            )
          })}
        </div>

        {/* Product Display */}
        <div className='sticky lg:mt-20 top-20'>
          <div className='bg-white shadow rounded-md px-4 py-3 mb-2'>
            <h3 className='font-semibold text-lg text-slate-700'>{subCategoryName}</h3>
          </div>

            {/* total products display after clicking see all */}
          <div className='min-h-[80vh] mt-8 lg:mt-0 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4'>
              {data.map((product) => (
                <CardProduct
                  key={`product-${product._id}`}
                  data={product}
                />
              ))}
            </div>

            {loading && <Loading />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
