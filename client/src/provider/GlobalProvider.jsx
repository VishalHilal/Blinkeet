import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart, initializeGuestCartFromStorage } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
     const dispatch = useDispatch()
     const [cartLoading, setCartLoading] = useState(true); // add this
     const [totalPrice,setTotalPrice] = useState(0)
     const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
    const [totalQty,setTotalQty] = useState(0)
    const cartItem = useSelector(state => state.cartItem.cart) || []
    const guestCart = useSelector(state => state.cartItem.guestCart) || []
    const user = useSelector(state => state?.user)

    // Check if user is authenticated
    const isAuthenticated = () => {
        const accessToken = localStorage.getItem('accesstoken');
        const refreshToken = localStorage.getItem('refreshToken');
        return !!(accessToken && refreshToken && user?._id);
    };

    const fetchCartItem = async()=>{
        if (!isAuthenticated()) {
          setCartLoading(false);
          return;
        }
        try {
          setCartLoading(true);
          const response = await Axios({
            ...SummaryApi.getCartItem
          })
          const { data : responseData } = response
    
          if(responseData.success){
            dispatch(handleAddItemCart(responseData.data))
          }
    
        } catch (error) {
          console.log(error)
        }finally{
          setCartLoading(false);
        }
    }

    const updateCartItem = async(id,qty)=>{
        if (!isAuthenticated()) {
            return;
        }
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
             await fetchCartItem()
              return responseData
          }
      } catch (error) {
        console.error("Failed to update cart item:", error);
        AxiosToastError(error)
        return error
      }
    }
    
    const deleteCartItem = async(cartId)=>{
        if (!isAuthenticated()) {
            return;
        }
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            await fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
      }
    }

    useEffect(()=>{
      // Reset totals when user state changes
      if (!user?._id) {
        setTotalQty(0);
        setTotalPrice(0);
        setNotDiscountTotalPrice(0);
      }
      
      if (user?._id) {
        // Logged in: use backend cart
        const qty = cartItem.reduce((preve,curr)=>{
            return preve + (curr.quantity || 0)
        },0)
        const tPrice = cartItem.reduce((preve,curr)=>{
            const price = curr?.productId?.price || 0;
            const discount = curr?.productId?.discount || 0;
            const quantity = curr.quantity || 0;
            const priceAfterDiscount = pricewithDiscount(price, discount)
            return preve + (priceAfterDiscount * quantity)
        },0)
        const notDiscountPrice = cartItem.reduce((preve,curr)=>{
          const price = curr?.productId?.price || 0;
          const quantity = curr.quantity || 0;
          return preve + (price * quantity)
        },0)
        setTotalQty(qty)
        setTotalPrice(tPrice)
        setNotDiscountTotalPrice(notDiscountPrice)
      } else {
        // Guest: use guestCart
        const qty = guestCart.reduce((preve, curr) =>{ return preve + (curr.quantity || 0)}, 0);
        const tPrice = guestCart.reduce((preve, curr) => {
            const price = curr.price || 0;
            const discount = curr.discount || 0;
            const quantity = curr.quantity || 0;
            return preve + pricewithDiscount(price, discount) * quantity
        }, 0);
        const notDiscountPrice = guestCart.reduce((preve, curr) => {
            const price = curr.price || 0;
            const quantity = curr.quantity || 0;
            return preve + (price * quantity)
        }, 0);
        setTotalQty(qty);
        setTotalPrice(tPrice);
        setNotDiscountTotalPrice(notDiscountPrice);
      }
  },[cartItem, guestCart, user])

    const handleLogoutOut = ()=>{
        localStorage.clear()
        dispatch(handleAddItemCart([]))
    }

    const fetchAddress = async()=>{
        if (!isAuthenticated()) {
            return;
        }
      try {
        const response = await Axios({
            ...SummaryApi.getAddress
        });
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          console.log('Error fetching address:', error)
      }
    }
    const fetchOrder = async()=>{
        if (!isAuthenticated()) {
            return;
        }
      try {
        const response = await Axios({
            ...SummaryApi.getOrderItems
        });
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }

    // Initialize guest cart from localStorage on app start
    useEffect(() => {
        dispatch(initializeGuestCartFromStorage());
    }, [dispatch]);

    useEffect( () => {
        if (isAuthenticated()) {
            fetchCartItem()
            fetchAddress()
            fetchOrder()
        } else {
            setCartLoading(false);
        }
    }, [user])

    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder,
            cartLoading
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider