import React from 'react';
import { IoClose } from "react-icons/io5";

const AddFieldComponent = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 sm:p-8 animate-fadeInUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Add Field</h2>
          <button
            onClick={close}
            className="text-gray-600 hover:text-red-500 transition"
            aria-label="Close"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Input Field */}
        <div className="mb-5">
          <input
            className="w-full p-3 rounded-md border text-sm bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
            placeholder="Enter field name"
            value={value}
            onChange={onChange}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submit}
          className="w-full py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition duration-200 shadow-sm hover:shadow-md"
        >
          Add Field
        </button>
      </div>
    </section>
  );
};

export default AddFieldComponent;
