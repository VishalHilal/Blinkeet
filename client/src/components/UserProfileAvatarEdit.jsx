import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../store/userSlice'
import { IoClose } from "react-icons/io5"

const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData
      })
      const { data: responseData } = response
      dispatch(updatedAvatar(responseData.data.avatar))
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative'>
        <button onClick={close} className='absolute top-4 right-4 text-gray-500 hover:text-red-500 transition'>
          <IoClose size={22} />
        </button>

        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md'>
            {user.avatar ? (
              <img
                alt={user.name}
                src={user.avatar}
                className='w-full h-full object-cover'
              />
            ) : (
              <FaRegUserCircle size={72} className='text-gray-400' />
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor='uploadProfile'>
              <div className='cursor-pointer bg-indigo-600 text-white px-5 py-2 text-sm rounded-md hover:bg-indigo-700 transition'>
                {loading ? "Uploading..." : "Upload"}
              </div>
              <input
                type='file'
                id='uploadProfile'
                className='hidden'
                onChange={handleUploadAvatarImage}
              />
            </label>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfileAvatarEdit
