import React, { useState } from 'react';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useNavigate } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProductClick = (e) => {
    if (e.target.closest('.add-to-cart-button')) return;
    navigate(url, { replace: true });
  };

  return (
    <div
      onClick={handleProductClick}
      className="lg:min-w-[300px] min-w-[220px] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[250px] rounded-2xl border shadow-md mb-2 overflow-hidden hover:shadow-lg transition-all cursor-pointer p-2 sm:p-3 space-y-1 sm:space-y-2"
    >
      {/* Discount Banner */}
      <div className="relative">
        {data.discount > 0 && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10 shadow-sm">
            {data.discount}% OFF
          </div>
        )}
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-52 object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Delivery Time */}
      <div className="text-xs font-medium text-green-600 bg-green-100 w-fit px-2 py-0.5 rounded-full">
        10 min delivery
      </div>

      {/* Product Name */}
      <h3 className="text-base lg:text-lg font-semibold text-gray-900 line-clamp-2">
        {data.name}
      </h3>

      {/* Unit */}
      <p className="text-sm text-gray-500">{data.unit}</p>

      {/* Price and Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-base lg:text-lg font-bold text-gray-800">
          {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
        </div>
        <div>
          {data.stock === 0 ? (
            <p className="text-sm text-red-500 font-medium">Out of stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
