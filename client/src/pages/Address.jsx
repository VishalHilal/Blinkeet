import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete, MdEdit } from "react-icons/md"
import EditAddressDetails from '../components/EditAddressDetails'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { useGlobalContext } from '../provider/GlobalProvider'

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })
      if (response.data.success) {
        toast.success("Address Removed")
        if (fetchAddress) {
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='bg-white shadow-sm px-4 py-3 flex justify-between items-center rounded-lg'>
        <h2 className='font-semibold text-lg text-gray-800'>Saved Addresses</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className='px-4 py-2 text-sm font-medium border border-primary-500 text-primary-600 rounded-full hover:bg-primary-500 hover:text-white transition-colors'
        >
          Add Address
        </button>
      </div>

      <div className='grid gap-4'>
        {
          addressList.map((address, index) => (
            <div
              key={address._id}
              className={`bg-white p-4 rounded-lg shadow-sm flex justify-between items-start gap-4 ${
                !address.status && 'hidden'
              }`}
            >
              <div className='text-sm text-gray-700 space-y-1'>
                <p className='font-medium'>{address.address_line}</p>
                <p>{address.city}</p>
                <p>{address.state}</p>
                <p>{address.country} - {address.pincode}</p>
                <p className='text-gray-500 text-sm'>📞 {address.mobile}</p>
              </div>
              <div className='flex flex-col gap-2 shrink-0'>
                <button
                  onClick={() => {
                    setOpenEdit(true)
                    setEditData(address)
                  }}
                  className='bg-green-100 text-green-700 p-2 rounded hover:bg-green-600 hover:text-white transition-colors'
                >
                  <MdEdit size={18} />
                </button>
                <button
                  onClick={() => handleDisableAddress(address._id)}
                  className='bg-red-100 text-red-700 p-2 rounded hover:bg-red-600 hover:text-white transition-colors'
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          ))
        }

        <div
          onClick={() => setOpenAddress(true)}
          className='cursor-pointer h-16 bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center text-blue-600 rounded-md hover:bg-blue-100 transition'
        >
          + Add New Address
        </div>
      </div>

      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} />
      )}

      {OpenEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  )
}

export default Address
