import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import imageEmpty from "../assets/empty_cart.webp";
import { Truck, ShoppingBag, FileText } from "lucide-react";

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const guestCart = useSelector((state) => state.cartItem.guestCart);
  const user = useSelector((state) => state.user);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const navigate = useNavigate();

  let guestTotalPrice = 0;
  let guestNotDiscountTotalPrice = 0;
  let guestTotalQty = 0;

  if (!user._id) {
    guestTotalQty = guestCart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    guestTotalPrice = guestCart.reduce((sum, item) => {
      const price = item.price || 0;
      const discount = item.discount || 0;
      const quantity = item.quantity || 0;
      return sum + pricewithDiscount(price, discount) * quantity;
    }, 0);
    guestNotDiscountTotalPrice = guestCart.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);
  }

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      setIsLoggedInUser(true);
      navigate("/checkout");
      if (close) {
        close();
      }
      return;
    }
    setIsLoggedInUser(false);
    navigate("/login");
    close();
  };

  const isLoggedIn = !!user._id;
  const displayCart = isLoggedIn ? cartItem : guestCart;
  const displayTotalPrice = isLoggedIn ? totalPrice : guestTotalPrice;
  const displayNotDiscountTotalPrice = isLoggedIn
    ? notDiscountTotalPrice
    : guestNotDiscountTotalPrice;
  const displayTotalQty = isLoggedIn ? totalQty : guestTotalQty;

  return (
    <section className="bg-black/60 fixed inset-0 z-50 font-[Inter]">
      <div className="bg-white w-full max-w-sm lg:max-w-md h-full ml-auto flex flex-col shadow-2xl rounded-l-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b bg-gray-50">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-800">My Cart</h2>
          <button
            onClick={() => {
              if (close) close();
              navigate("/");
            }}
          >
            <IoClose
              size={24}
              className="text-gray-600 hover:text-red-500 transition"
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 lg:px-6 py-3 lg:py-4 space-y-4">
          {displayCart.length > 0 ? (
            <>
              <div className="flex justify-between items-center bg-green-100 text-green-800 px-4 lg:px-5 py-2 lg:py-3 rounded-xl text-sm lg:text-base font-medium">
                <span className="text-xl">Your total savings</span>
                <span className="text-xl">
                  {DisplayPriceInRupees(
                    displayNotDiscountTotalPrice - displayTotalPrice
                  )}
                </span>
              </div>

              <div className="bg-white p-4 lg:p-6 rounded-2xl shadow space-y-4">
                {displayCart.map((item, index) => {
                  const product = isLoggedIn ? item.productId : item;
                  return (
                    <div
                      key={(product?._id || index) + "cartItemDisplay"}
                      className="flex gap-3 lg:gap-4 items-start"
                    >
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 border rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={product?.image?.[0]}
                          alt={product?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow space-y-1 text-sm lg:text-base">
                        <p className="font-medium  text-xl text-gray-900 line-clamp-2">
                          {product?.name}
                        </p>
                        <p className="text-gray-500">{product?.unit}</p>
                        <p className="font-semibold text-xl text-black">
                          {DisplayPriceInRupees(
                            pricewithDiscount(product?.price, product?.discount)
                          )}
                        </p>
                      </div>
                      <AddToCartButton data={product} size="sm" />
                    </div>
                  );
                })}
              </div>

              <div className="bg-white p-4 lg:p-6 rounded-2xl shadow space-y-3 text-sm lg:text-base">
                <h3 className="font-bold text-gray-800 mb-2 text-base lg:text-lg">Bill Details</h3>

                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-xl">Items total</span>
                  </div>
                  <span className="flex items-center gap-2">
                    <s className="text-gray-400">
                      {DisplayPriceInRupees(displayNotDiscountTotalPrice)}
                    </s>
                    <span className="text-xl">{DisplayPriceInRupees(displayTotalPrice)}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 text-black-600" />
                    <span className="text-xl">Quantity</span>
                  </div>
                  <span className="text-xl">{displayTotalQty} item</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 lg:w-5 lg:h-5 text-black-600" />
                    <span className="text-xl">Delivery Charge</span>
                  </div>
                  <span className="text-green-600 text-xl font-medium">Free</span>
                </div>

                <div className="flex justify-between items-center font-semibold text-gray-800 text-base lg:text-lg border-t pt-2 mt-2">
                  <span className="text-xl">Grand total</span>
                  <span>{DisplayPriceInRupees(displayTotalPrice)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <img
                src={imageEmpty}
                className="w-40 h-40 lg:w-52 lg:h-52 object-contain mb-4"
                alt="Empty cart"
              />
              <Link
                onClick={close}
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white px-5 lg:px-6 py-2 lg:py-3 rounded-full font-medium transition text-sm lg:text-base"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {displayCart.length > 0 && (
          <div className="p-4 lg:p-6 border-t bg-white">
            <div className="bg-green-700 hover:bg-green-800 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-xl flex justify-between items-center font-semibold text-base lg:text-lg transition">
              <span>{DisplayPriceInRupees(displayTotalPrice)}</span>
              <button
                onClick={redirectToCheckoutPage}
                className="flex items-center gap-1"
              >
                {isLoggedIn ? "Proceed" : "Login to Proceed"}
                <FaCaretRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
