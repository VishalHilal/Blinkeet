import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const valideValue = Object.values(data).every(el => el)

  useEffect(() => {
    if (!(location?.state?.data?.success)) {
      navigate("/")
    }

    if (location?.state?.email) {
      setData(prev => ({
        ...prev,
        email: location.state.email
      }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must be same.")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/login")
        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='w-full min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-green-50 to-white'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
        <h2 className='text-2xl font-bold text-center text-green-800 mb-6'>Reset Your Password</h2>

        <form className='space-y-5' onSubmit={handleSubmit}>
          <div className='space-y-1'>
            <label htmlFor='newPassword' className='text-sm font-medium text-gray-700'>New Password</label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                id='newPassword'
                name='newPassword'
                value={data.newPassword}
                onChange={handleChange}
                placeholder='Enter your new password'
                className='w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300 pr-10'
              />
              <div
                onClick={() => setShowPassword(prev => !prev)}
                className='absolute right-3 top-2.5 text-gray-600 cursor-pointer'
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <div className='space-y-1'>
            <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700'>Confirm Password</label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id='confirmPassword'
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm your password'
                className='w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300 pr-10'
              />
              <div
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className='absolute right-3 top-2.5 text-gray-600 cursor-pointer'
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition duration-200 ${
              valideValue ? "bg-green-700 hover:bg-green-800" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Change Password
          </button>
        </form>

        <p className='text-sm text-center text-gray-600 mt-6'>
          Already have an account?{" "}
          <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword
