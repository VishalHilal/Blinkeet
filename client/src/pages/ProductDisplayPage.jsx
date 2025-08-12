import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ALLOWED_CATEGORIES = [
    'Age Group',
    'Author',
    'Brand',
    'Caffeine Content',
    'Certification',
    'Cooking Instructions',
    'Country of Origin',
    'Cut Type',
    'Description',
    'Dosage Instructions',
    'Edition',
    'Expiry Date',
    'FSSAI License',
    'Flavour',
    'Genre',
    'Ingredients',
    'Key Features',
    'Language',
    'Manufacturer',
    'Material',
    'Name',
    'Number of Pages',
    'Nutritional Information',
    'Packaging Type',
    'Pet Type',
    'Product Name',
    'Publisher',
    'Return Policy',
    'Seller',
    'Shelf Life',
    'Shade',
    'Skin Type',
    'Storage Instructions',
    'Storage Tips',
    'Storage Type',
    'Title',
    'Type',
    'Unit',
    'Usage Instructions',
    'Variety',
    'Weight'
];

const ProductDisplayPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data,setData] = useState({
    name : "",
    image : []
  })
  const [image,setImage] = useState(0)
  const [loading,setLoading] = useState(false)
  const [showMobileDescription, setShowMobileDescription] = useState(false)
  const imageContainer = useRef()

  // Manage history state
  useEffect(() => {
    // Replace the current history entry with a new one that includes state
    window.history.replaceState(
      { ...window.history.state, fromProductList: true },
      '',
      location.pathname
    );

    // Add a listener for popstate to handle back button
    const handlePopState = (event) => {
      if (event.state?.fromProductList) {
        // If coming from product list, go back to home
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, navigate]);

  const fetchProductDetails = async()=>{
    try {
        const response = await Axios({
          ...SummaryApi.getProductDetails,
          data : {
            productId : productId 
          }
        })

        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data)
        }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])
  
  const handleScrollRight = () => {
    if (imageContainer.current) {
      const scrollAmount = imageContainer.current.offsetWidth * 0.8; // Scroll 80% of container width
      imageContainer.current.scrollTo({
        left: imageContainer.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      const scrollAmount = imageContainer.current.offsetWidth * 0.8; // Scroll 80% of container width
      imageContainer.current.scrollTo({
        left: imageContainer.current.scrollLeft - scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  // Add scroll event listener to show/hide navigation buttons
  useEffect(() => {
    const container = imageContainer.current;
    if (!container) return;

    const handleScroll = () => {
      const showLeftButton = container.scrollLeft > 0;
      const showRightButton = container.scrollLeft < (container.scrollWidth - container.clientWidth);
      
      const leftButton = container.parentElement.querySelector('.scroll-left-button');
      const rightButton = container.parentElement.querySelector('.scroll-right-button');
      
      if (leftButton) {
        leftButton.style.opacity = showLeftButton ? '1' : '0';
        leftButton.style.pointerEvents = showLeftButton ? 'auto' : 'none';
      }
      if (rightButton) {
        rightButton.style.opacity = showRightButton ? '1' : '0';
        rightButton.style.pointerEvents = showRightButton ? 'auto' : 'none';
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [data.image]); // Re-run when images change

  return (
   <section className='container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6'>
  {/* Left: Image section */}
  <div className='space-y-4'>
    {/* Main Image */}
    <div className='bg-white mt-24 rounded-xl overflow-hidden shadow-md min-h-56 max-h-56 sm:min-h-[40vh] sm:max-h-[40vh] lg:min-h-[65vh] lg:max-h-[65vh] flex items-center justify-center'>
      {data.image[image] && (
        <img
          src={data.image[image]}
          className='w-4/5 lg:w-fit h-full object-contain'
          alt={data.name}
        />
      )}
    </div>

    {/* Image Dots */}
    <div className='flex items-center justify-center gap-2'>
      {data.image.map((img, index) => (
        <button
          key={img + index + "dot"}
          onClick={() => setImage(index)}
          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
            index === image ? "bg-primary-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>

    {/* Thumbnail Strip */}
    <div className='relative'>
      <div
        ref={imageContainer}
        className='flex gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {data.image.map((img, index) => (
          <div
            key={img + index}
            onClick={() => setImage(index)}
            className='min-w-20 min-h-20 w-20 h-20 cursor-pointer rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 hover:scale-105 transition-transform duration-200 snap-start'
          >
            <img
              src={img}
              className={`w-full h-full object-contain ${index === image ? 'ring-2 ring-primary-500' : ''}`}
              alt={`Thumbnail ${index}`}
            />
          </div>
        ))}
      </div>

      {/* Scroll buttons */}
      <div className='absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none'>
        <button
          onClick={handleScrollLeft}
          className='scroll-left-button bg-white shadow-md p-2 rounded-full ml-2 opacity-0 pointer-events-none hover:scale-105 transition'
          aria-label="Scroll left"
        >
          <FaAngleLeft />
        </button>
        <button
          onClick={handleScrollRight}
          className='scroll-right-button bg-white shadow-md p-2 rounded-full mr-2 opacity-0 pointer-events-none hover:scale-105 transition'
          aria-label="Scroll right"
        >
          <FaAngleRight />
        </button>
      </div>
    </div>

    {/* Description Desktop */}
    <div className='hidden lg:grid gap-4'>
      {data.description && (
        <div>
          <h3 className='font-semibold text-lg mb-1'>Description</h3>
          <p className='text-gray-700'>{data.description}</p>
        </div>
      )}
      {data.unit && (
        <div>
          <h3 className='font-semibold text-lg mb-1'>Unit</h3>
          <p className='text-gray-700'>{data.unit}</p>
        </div>
      )}
      {data?.more_details &&
        Object.keys(data?.more_details)
          .filter(key =>
            ALLOWED_CATEGORIES.includes(key) &&
            data.more_details[key] &&
            (typeof data.more_details[key] === 'string'
              ? data.more_details[key].trim()
              : Array.isArray(data.more_details[key])
              ? data.more_details[key].length > 0
              : Object.keys(data.more_details[key]).length > 0)
          )
          .map((key, idx) => (
            <div key={`details-${key}-${idx}`}>
              <h3 className='font-semibold text-lg'>{key}</h3>
              <p className='text-gray-700'>
                {Array.isArray(data.more_details[key])
                  ? data.more_details[key].join(', ')
                  : data.more_details[key]}
              </p>
            </div>
          ))}
    </div>
  </div>

  {/* Right: Info section */}
  <div className='p-1 sm:p-2 md:p-4 space-y-6'>
    <div className='flex items-center gap-2'>
      <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>10 Min</span>
    </div>

    <div>
      <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>{data.name}</h1>
      <p className='text-gray-500 text-base'>{data.unit}</p>
    </div>

    <Divider />

    <div>
      <p className='text-gray-700'>Price</p>
      <div className='flex items-center gap-3 mt-1 flex-wrap'>
        <span className='bg-green-50 text-green-700 border border-green-600 px-4 py-2 rounded text-lg sm:text-xl font-semibold'>
          {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
        </span>
        {data.discount && (
          <>
            <span className='line-through text-gray-400'>{DisplayPriceInRupees(data.price)}</span>
            <span className='text-green-600 font-bold text-lg'>{data.discount}% <span className='text-sm'>off</span></span>
          </>
        )}
      </div>
    </div>

    {data.stock === 0 ? (
      <p className='text-red-600 font-semibold'>Out of Stock</p>
    ) : (
      <div className='pt-2 sm:pt-4'>
        <AddToCartButton data={data} />
      </div>
    )}

    {/* Why Shop */}
    <div>
      <h3 className='font-semibold text-xl mb-3'>Why shop from Binkeet?</h3>
      {[image1, image2, image3].map((img, idx) => {
        const captions = [
          { title: 'Superfast Delivery', desc: 'Delivered in minutes from dark stores near you.' },
          { title: 'Best Prices & Offers', desc: 'Exclusive deals direct from manufacturers.' },
          { title: 'Wide Assortment', desc: 'Choose from 5000+ products across categories.' }
        ];
        return (
          <div className='flex items-start gap-4 mb-4' key={`why-${idx}`}>
            <img src={img} alt={captions[idx].title} className='w-14 h-14 sm:w-16 sm:h-16 object-contain' />
            <div>
              <h4 className='font-medium text-gray-800'>{captions[idx].title}</h4>
              <p className='text-sm text-gray-600'>{captions[idx].desc}</p>
            </div>
          </div>
        );
      })}
    </div>

    {/* Mobile Description */}
    <div className='lg:hidden'>
      <button
        onClick={() => setShowMobileDescription(!showMobileDescription)}
        className='w-full flex justify-between items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200'
      >
        <span className='font-semibold'>View Description</span>
        <span className='text-gray-500 text-sm'>{showMobileDescription ? 'Hide' : 'Show'}</span>
      </button>

      {showMobileDescription && (
        <div className='bg-white p-4 mt-3 rounded-lg shadow'>
          {[data.description && { label: 'Description', value: data.description },
            data.unit && { label: 'Unit', value: data.unit },
            ...Object.entries(data.more_details || {})
              .filter(([key, val]) =>
                ALLOWED_CATEGORIES.includes(key) &&
                (typeof val === 'string' ? val.trim() : Array.isArray(val) ? val.length : Object.keys(val).length))
              .map(([key, val]) => ({
                label: key,
                value: Array.isArray(val) ? val.join(', ') : val
              }))]
            .filter(Boolean)
            .map(({ label, value }, i) => (
              <div key={`mobile-detail-${i}`} className='mb-2'>
                <p className='font-semibold text-sm'>{label}</p>
                <p className='text-sm text-gray-600'>{value}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  </div>
</section>


  )
}

export default ProductDisplayPage
