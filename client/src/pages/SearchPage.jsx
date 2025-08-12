import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'
import Search from '../components/Search'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((preve) => [...preve, ...responseData.data])
        }
        setTotalPage(responseData.totalPage)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((preve) => preve + 1)
    }
  }

  return (
    <section className='bg-gradient-to-br from-slate-50 to-blue-50 min-h-[90vh]'>
      <div className='container mx-auto px-4 py-6'>
        <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-white shadow px-4 py-2">
  <Search />
</div>

        <p className='text-xl font-semibold text-slate-800 mb-4'>
          Search Results: <span className='text-primary-600'>{data.length}</span>
        </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
            {
              data.map((p, index) => (
                <CardProduct data={p} key={p?._id + "searchProduct" + index} />
              ))
            }

            {
              loading && loadingArrayCard.map((_, index) => (
                <CardLoading key={"loadingsearchpage" + index} />
              ))
            }
          </div>
        </InfiniteScroll>

        {
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center text-center py-10'>
              <img
                src={noDataImage}
                className='w-56 h-56 object-contain mb-4'
                alt='No Data'
              />
              <p className='text-lg font-semibold text-slate-600'>No products found</p>
              <p className='text-sm text-slate-500'>Try searching something else.</p>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default SearchPage
