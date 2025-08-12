import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const Cancel = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-red-200 flex flex-col items-center text-center space-y-4">
        <XCircle className="text-red-600" size={56} strokeWidth={1.5} />
        <h2 className="text-2xl font-semibold text-red-700">
          Order Cancelled
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your payment was not completed. You can return to the homepage to continue shopping.
        </p>
        <Link
          to="/"
          className="inline-block mt-2 bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-red-700 transition duration-200"
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
