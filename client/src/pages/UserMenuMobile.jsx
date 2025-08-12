import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5"

const UserMenuMobile = () => {
  return (
    <section className="bg-white h-full w-full py-4 px-4 sm:px-6 shadow-sm">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => window.history.back()}
          className="text-gray-700 hover:text-red-500 transition-colors duration-200"
          aria-label="Close menu"
        >
          <IoClose size={28} />
        </button>
      </div>
      <div className="container mx-auto max-w-md pb-8">
        <UserMenu />
      </div>
    </section>
  )
}

export default UserMenuMobile
