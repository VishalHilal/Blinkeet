import React from 'react';

const CardLoading = () => {
  return (
    <div className="border py-2 lg:p-4 grid gap-2 lg:gap-4 min-w-36 lg:min-w-52 rounded-2xl cursor-pointer bg-white shadow-sm animate-pulse transition-all duration-300">
      
      {/* Image skeleton */}
      <div className="min-h-24 bg-gray-100 rounded-xl" />

      {/* Title placeholder */}
      <div className="h-4 lg:h-5 bg-gray-100 rounded-md w-24 lg:w-28 mx-2" />

      {/* Description placeholder */}
      <div className="h-4 lg:h-5 bg-gray-100 rounded-md mx-2" />

      {/* Price placeholder */}
      <div className="h-4 lg:h-5 bg-gray-100 rounded-md w-16 mx-2" />

      {/* Button row */}
      <div className="flex items-center justify-between gap-3 px-2">
        <div className="h-4 lg:h-5 bg-gray-100 rounded-md w-20" />
        <div className="h-4 lg:h-5 bg-gray-100 rounded-md w-20" />
      </div>

    </div>
  );
};

export default CardLoading;
