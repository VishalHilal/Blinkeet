import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({ url, close }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4'>
      <div className='relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-4'>
        <button
          onClick={close}
          className='absolute top-3 right-3 text-gray-500 hover:text-red-500 transition'
        >
          <IoClose size={24} />
        </button>

        <div className='max-h-[80vh] overflow-hidden flex justify-center items-center'>
          <img
            src={url}
            alt='Full View'
            className='max-h-[70vh] w-auto object-contain rounded-md'
          />
        </div>
      </div>
    </div>
  )
}

export default ViewImage
