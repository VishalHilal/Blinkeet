import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa"
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { setUserDetails } from '../store/userSlice'
import fetchUserDetails from '../utils/fetchUserDetails'

const Profile = () => {
  const user = useSelector(state => state.user)
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    })
  }, [user])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 max-w-2xl mx-auto'>
      {/* Profile image */}
      <div className='flex flex-col items-center gap-3'>
        <div className='w-24 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center rounded-full overflow-hidden shadow'>
          {
            user.avatar ? (
              <img
                alt={user.name}
                src={user.avatar}
                className='w-full h-full object-cover'
              />
            ) : (
              <FaRegUserCircle size={75} className='text-gray-400' />
            )
          }
        </div>

        <button
          onClick={() => setProfileAvatarEdit(true)}
          className='text-sm border border-primary-100 hover:bg-primary-200 hover:text-white transition px-4 py-1 rounded-full'
        >
          Edit
        </button>

        {openProfileAvatarEdit && (
          <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className='mt-6 bg-white shadow rounded-xl p-6 space-y-5'>
        <div className='grid gap-1'>
          <label className='text-sm text-gray-600'>Name</label>
          <input
            type='text'
            placeholder='Enter your name'
            className='p-2 bg-blue-50 outline-none border border-gray-300 focus:ring-2 focus:ring-primary-200 rounded-md'
            value={userData.name}
            name='name'
            onChange={handleOnChange}
            required
          />
        </div>
        <div className='grid gap-1'>
          <label htmlFor='email' className='text-sm text-gray-600'>Email</label>
          <input
            type='email'
            id='email'
            placeholder='Enter your email'
            className='p-2 bg-blue-50 outline-none border border-gray-300 focus:ring-2 focus:ring-primary-200 rounded-md'
            value={userData.email}
            name='email'
            onChange={handleOnChange}
            required
          />
        </div>
        <div className='grid gap-1'>
          <label htmlFor='mobile' className='text-sm text-gray-600'>Mobile</label>
          <input
            type='text'
            id='mobile'
            placeholder='Enter your mobile'
            className='p-2 bg-blue-50 outline-none border border-gray-300 focus:ring-2 focus:ring-primary-200 rounded-md'
            value={userData.mobile}
            name='mobile'
            onChange={handleOnChange}
            required
          />
        </div>

        <button
          type='submit'
          className='w-full bg-primary-200 hover:bg-primary-300 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default Profile
