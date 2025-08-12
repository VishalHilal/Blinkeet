import React from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/NoData';

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order);
  
  return (
    <div className='min-h-screen bg-gray-50 py-6 px-4'>
      <div className='bg-white shadow-sm p-4 rounded-lg mb-6 border border-gray-200'>
        <h1 className='text-2xl font-semibold text-green-700'>My Orders</h1>
      </div>

      {!orders[0] && <NoData />}

      {orders.map((order, index) => (
        <div
          key={order._id + index + "order"}
          className='bg-white p-4 mb-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all'
        >
          <p className='text-sm text-gray-500 mb-2'>Order No: <span className='font-medium text-gray-800'>{order?.orderId}</span></p>

          <div className='flex items-center gap-4'>
            <img
              src={order.product_details.image[0]}
              alt={order.product_details.name}
              className='w-16 h-16 rounded-lg object-cover border border-gray-200'
            />
            <div>
              <p className='font-medium text-gray-800'>{order.product_details.name}</p>
              {/* You can include price, qty or status here if needed */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
