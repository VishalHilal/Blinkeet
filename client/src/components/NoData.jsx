import React from 'react'
import noDataImage from '../assets/nothing here yet.webp'

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3 text-center">
      <img
        src={noDataImage}
        alt="No data"
        className="w-40 max-w-full opacity-80"
      />
      <p className="text-gray-500 text-base font-medium">Nothing to display here</p>
    </div>
  )
}

export default NoData
