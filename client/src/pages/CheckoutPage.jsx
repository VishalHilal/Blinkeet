import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import StripePayment from '../components/StripePayment'
import UPIPayment from '../components/UPIPayment'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('card') // 'cod' or 'card' or 'upi'
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (!user._id) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  const handleCashOnDelivery = async() => {
      if (!addressList[selectAddress]?._id) {
          toast.error('Please add and select a delivery address first')
          return
      }

      try {
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                await fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success',{
                state : {
                  text : "Order"
                }
              })
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

  return (
    <section className="bg-blue-50 min-h-screen py-8">
  <div className="container mx-auto px-4 flex mt-14 lg:mt-28 flex-col lg:flex-row gap-6">
    {/* Left: Address Section */}
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Choose your Address</h3>
      <div className="bg-white p-5 rounded-2xl shadow-md">
        {addressList.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No delivery addresses found. Please add one to continue.
          </div>
        ) : (
          addressList.map((address, index) => (
            <label
              key={address._id}
              htmlFor={`address${index}`}
              className={address.status ? "block" : "hidden"}
            >
              <div className={`border rounded-xl px-4 py-3 mb-3 flex items-start gap-3 transition hover:bg-blue-50`}>
                <input
                  id={`address${index}`}
                  type="radio"
                  value={index}
                  onChange={(e) => setSelectAddress(e.target.value)}
                  name="address"
                  checked={Number(selectAddress) === index}
                  className="mt-1 w-5 h-5 accent-blue-600"
                />
                <div className="text-gray-700 text-sm">
                  <p className="font-semibold">{address.address_line}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>{address.country} - {address.pincode}</p>
                  <p className="font-medium mt-1">{address.mobile}</p>
                </div>
              </div>
            </label>
          ))
        )}
        <div
          onClick={() => setOpenAddress(true)}
          className="mt-4 h-16 bg-blue-100/40 border-2 border-dashed border-blue-300 flex justify-center items-center rounded-xl text-blue-600 cursor-pointer hover:bg-blue-200/40 transition-all"
        >
          {addressList.length === 0 ? 'Add your first address' : 'Add another address'}
        </div>
      </div>
    </div>

    {/* Right: Summary + Payment */}
    <div className="w-full lg:mt-11 max-w-md space-y-5">
      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <p>Items Total</p>
            <p className="flex items-center gap-2">
              <span className="line-through text-neutral-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
              <span className="font-semibold">{DisplayPriceInRupees(totalPrice)}</span>
            </p>
          </div>
          <div className="flex justify-between">
            <p>Total Quantity</p>
            <p className="font-medium">{totalQty} items</p>
          </div>
          <div className="flex justify-between">
            <p>Delivery Charge</p>
            <p className="font-medium text-green-600">Free</p>
          </div>
          <div className="border-t pt-4 flex justify-between items-center font-bold text-gray-800">
            <p>Grand Total</p>
            <p className="text-lg">{DisplayPriceInRupees(totalPrice)}</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h3>
        <div className="space-y-4 text-sm text-gray-700">
          {['card', 'upi', 'cod'].map((method) => (
            <div className="flex items-center gap-3" key={method}>
              <input
                type="radio"
                id={method}
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 accent-blue-600"
              />
              <label htmlFor={method} className="capitalize">{method === 'cod' ? 'Cash on Delivery' : `${method.toUpperCase()} Payment`}</label>
            </div>
          ))}

          {/* Payment UI */}
          <div className="mt-5">
            {paymentMethod === 'cod' ? (
              <button
                onClick={handleCashOnDelivery}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-sm transition-transform transform hover:scale-[1.02]"
              >
                Pay on Delivery
              </button>
            ) : (
              !addressList[selectAddress]?._id ? (
                <div className="text-center p-4 bg-red-100 text-red-600 rounded-xl text-sm">
                  Please add and select a delivery address first
                </div>
              ) : (
                <>
                  {paymentMethod === 'card' && (
                    <StripePayment
                      amount={totalPrice}
                      addressId={addressList[selectAddress]?._id}
                      cartItems={cartItemsList}
                      user={user}
                      address={addressList[selectAddress]}
                      onSuccess={async () => {
                        if (fetchCartItem) await fetchCartItem();
                        if (fetchOrder) await fetchOrder();
                      }}
                    />
                  )}
                  {paymentMethod === 'upi' && (
                    <UPIPayment
                      amount={totalPrice}
                      addressId={addressList[selectAddress]?._id}
                      cartItems={cartItemsList}
                      onSuccess={async () => {
                        if (fetchCartItem) await fetchCartItem();
                        if (fetchOrder) await fetchOrder();
                      }}
                    />
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

  {openAddress && (
    <AddAddress close={() => setOpenAddress(false)} />
  )}
</section>

  )
}

export default CheckoutPage
