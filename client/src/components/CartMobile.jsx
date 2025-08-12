import React from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { FaCartShopping } from 'react-icons/fa6';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { FaCaretRight } from "react-icons/fa";

const CartMobileLink = ({ openCartSection }) => {
  const { totalPrice, totalQty } = useGlobalContext();

  return (
    <>
      {totalQty > 0 && (
        <div className="sticky bottom-4 px-4 z-40">
          <div className="bg-green-600 text-white rounded-2xl px-4 py-3 shadow-md flex items-center justify-between gap-4 lg:hidden transition-all duration-300">
            
            {/* Left: Cart icon & details */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-full shadow-sm">
                <FaCartShopping size={16} />
              </div>
              <div className="text-sm leading-tight">
                <p className="font-medium">{totalQty} item{totalQty > 1 ? 's' : ''}</p>
                <p className="text-xs opacity-90">{DisplayPriceInRupees(totalPrice)}</p>
              </div>
            </div>

            {/* Right: View Cart Button */}
            <button 
              onClick={openCartSection} 
              className="flex items-center gap-1 text-sm font-semibold hover:underline transition"
            >
              <span>View Cart</span>
              <FaCaretRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobileLink;
