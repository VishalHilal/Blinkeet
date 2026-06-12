import { useNavigate } from 'react-router-dom';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { valideURLConvert } from '../utils/valideURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const navigate = useNavigate();

  const discountedPrice = pricewithDiscount(data.price, data.discount);

  const handleProductClick = (e) => {
    if (e.target.closest('.add-to-cart-button')) return;
    navigate(url, { replace: true });
  };

  return (
    <div
      onClick={handleProductClick}
      /* 
        Mobile  : 140px wide — fits ~2.4 cards on a 360px screen, feels like Blinkit/Zepto
        sm      : 160px
        md      : 185px
        lg+     : 210px
      */
      className="
        w-[140px] sm:w-[160px] md:w-[185px] lg:w-[210px]
        flex-shrink-0
        bg-white rounded-2xl border border-gray-100
        shadow-sm hover:shadow-md
        transition-all duration-200
        cursor-pointer
        overflow-hidden
        flex flex-col
      "
    >
      {/* Image area */}
      <div className="relative bg-gray-50 rounded-xl m-2 mb-0">
        {/* Discount badge */}
        {data.discount > 0 && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            {data.discount}% OFF
          </span>
        )}

        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-[110px] sm:h-[130px] md:h-[140px] lg:h-[160px] object-contain p-2"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2.5 pt-2 pb-3 gap-1">
        {/* Delivery badge */}
        <span className="text-[10px] font-semibold text-green-700 bg-green-50 w-fit px-2 py-0.5 rounded-full leading-none">
          10 min
        </span>

        {/* Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mt-0.5">
          {data.name}
        </h3>

        {/* Unit */}
        <p className="text-[11px] text-gray-400">{data.unit}</p>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <div>
            <p className="text-sm sm:text-base font-bold text-gray-900 leading-none">
              {DisplayPriceInRupees(discountedPrice)}
            </p>
            {data.discount > 0 && (
              <p className="text-[10px] text-gray-400 line-through leading-none mt-0.5">
                {DisplayPriceInRupees(data.price)}
              </p>
            )}
          </div>

          {data.stock === 0 ? (
            <span className="text-[10px] text-red-500 font-semibold text-right leading-tight">
              Out of<br />stock
            </span>
          ) : (
            <AddToCartButton data={data} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
