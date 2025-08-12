import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useNavigate } from 'react-router-dom';

const UPIPayment = ({ amount, addressId, cartItems, onSuccess }) => {
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;

  const validateUPI = (upi) => {
    if (!upi) {
      setError('UPI ID is required');
      return false;
    }
    if (!upiRegex.test(upi)) {
      setError('Please enter a valid UPI ID (e.g., name@bank)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUPI(upiId)) return;
    if (!addressId) return toast.error('Please select a delivery address');
    if (!cartItems?.length) return toast.error('Your cart is empty');

    setProcessing(true);
    try {
      const subTotalAmt = cartItems.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
      );

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          totalAmt: amount,
          subTotalAmt,
          addressId,
          payment_method: 'upi',
          upi_id: upiId,
        },
      });

      if (!response.data.success) throw new Error(response.data.message || 'Payment failed');

      toast.success('Payment successful!');

      const mockPaymentIntent = {
        id: `pi_${Date.now()}`,
        status: 'succeeded',
        amount: amount * 100,
        currency: 'inr',
        payment_method: 'upi',
        payment_method_details: {
          type: 'upi',
          upi: { vpa: upiId },
        },
      };

      await onSuccess(mockPaymentIntent);

      navigate('/success', {
        state: { text: 'Order', paymentId: mockPaymentIntent.id },
      });
    } catch (error) {
      console.error('UPI Payment Error:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 max-w-xl w-full mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Pay using UPI</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
            UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              validateUPI(e.target.value);
            }}
            placeholder="e.g. name@bank"
            className={`w-full px-4 py-2 text-sm rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={processing}
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          <p className="text-xs text-gray-500 mt-1">Example: name@bank, name@upi, name@paytm</p>
          <p className="text-xs text-blue-500 mt-2">
            Note: This is a demo. Any valid UPI ID will simulate a successful payment.
          </p>
        </div>

        <button
          type="submit"
          disabled={processing || !upiId || !!error || !addressId}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition duration-200 ${
            processing || !upiId || !!error || !addressId
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {processing ? 'Processing...' : `Pay ₹${amount}`}
        </button>

        <div className="mt-5 text-sm text-gray-600">
          <p className="font-medium mb-2">Supported UPI Apps:</p>
          <div className="flex flex-wrap gap-2">
            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
              <span key={app} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                {app}
              </span>
            ))}
          </div>
        </div>

        {!addressId && (
          <p className="text-sm text-red-600 mt-3">
            Please select a delivery address before proceeding.
          </p>
        )}
      </form>
    </div>
  );
};

export default UPIPayment;
