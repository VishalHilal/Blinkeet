// UPDATED: Added support for Stripe Checkout Session instead of just redirect URL
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ amount, addressId, cartItems }) => {

  console.log("amount is" , amount);
  console.log("addrssId is", addressId);
  console.log('cart items are ', cartItems);


  const handleStripeCheckout = async () => {
    if (amount === 0) {
      alert('Please add some items first');
      return;
    }

  console.log("amount is" , amount);
  console.log("addrssId is", addressId);
  console.log('cart items are ', cartItems);


    try {
      // ✅ UPDATED: Call backend to create Stripe Checkout session
      const response = await Axios({
        ...SummaryApi.stripe_create_intent,
        data: {
          amount,
          addressId,
          cartItems,
        },
      });

      const { data: resData } = response;
      // ✅ UPDATED: Instead of checking `url`, we now use Stripe's `redirectToCheckout`
      if (resData.id) {
      setTimeout(async()=>{
          const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: resData.id });
        const session = await resData.id;
        console.log(session);
      },1000)
      } else {
        console.error("No session ID received from backend");
      }
    } catch (error) {

      if(error.status ===500){
        toast.error("please add more idems to cart");
      }
      console.error(error);
    }

  };

  return (
    <div className="mt-4">
      <button
        onClick={handleStripeCheckout}
        className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium text-sm shadow-md hover:from-indigo-600 hover:to-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
      >
        Pay with Card
      </button>
    </div>
  );
};

export default StripePayment;
