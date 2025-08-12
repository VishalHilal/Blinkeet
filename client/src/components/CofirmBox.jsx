import React from 'react'
import { IoClose } from "react-icons/io5"

const CofirmBox = ({ cancel, confirm, close }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex justify-center items-center">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">Permanent Delete</h1>
          <button
            onClick={close}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mt-4">
          Are you sure you want to permanently delete this?
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={cancel}
            className="px-4 py-1.5 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="px-4 py-1.5 border border-green-600 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default CofirmBox
