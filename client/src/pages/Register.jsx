import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must be same")
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 to-white px-4 py-10'>
            <div className='w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8'>
                <h2 className='text-3xl font-bold text-center text-green-800 mb-6'>Create Your Account</h2>

                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='name' className='block mb-1 text-sm font-medium text-gray-700'>Name</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                            className='w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                    </div>

                    <div>
                        <label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-700'>Email</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            className='w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                    </div>

                    <div>
                        <label htmlFor='password' className='block mb-1 text-sm font-medium text-gray-700'>Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter password'
                                className='w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 pr-12'
                            />
                            <div
                                onClick={() => setShowPassword(prev => !prev)}
                                className='absolute right-3 top-3 text-gray-500 cursor-pointer'
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor='confirmPassword' className='block mb-1 text-sm font-medium text-gray-700'>Confirm Password</label>
                        <div className='relative'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Confirm password'
                                className='w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 pr-12'
                            />
                            <div
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className='absolute right-3 top-3 text-gray-500 cursor-pointer'
                            >
                                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!valideValue}
                        className={`w-full py-2 px-4 rounded-xl font-semibold text-white transition duration-300 ${
                            valideValue ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        Register
                    </button>
                </form>

                <p className='text-sm text-center text-gray-600 mt-6'>
                    Already have an account?{" "}
                    <Link to={"/login"} className='font-medium text-green-700 hover:text-green-800'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default Register
