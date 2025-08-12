import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [])

    const valideValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4'>
            <div className='bg-white shadow-xl border border-gray-200 rounded-2xl p-8 w-full max-w-md'>
                <h2 className='text-2xl font-bold text-green-800 mb-4 text-center'>OTP Verification</h2>
                <p className='text-gray-600 text-center mb-6'>Enter the 6-digit code sent to your email</p>

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div className='flex justify-between gap-2'>
                        {data.map((element, index) => (
                            <input
                                key={"otp" + index}
                                type='text'
                                id='otp'
                                ref={(ref) => {
                                    inputRef.current[index] = ref
                                    return ref
                                }}
                                value={data[index]}
                                onChange={(e) => {
                                    const value = e.target.value
                                    const newData = [...data]
                                    newData[index] = value
                                    setData(newData)

                                    if (value && index < 5) {
                                        inputRef.current[index + 1]?.focus()
                                    }
                                }}
                                maxLength={1}
                                className='w-12 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400'
                            />
                        ))}
                    </div>

                    <button
                        disabled={!valideValue}
                        className={`w-full py-2 rounded-lg font-semibold text-white transition ${
                            valideValue ? "bg-green-700 hover:bg-green-800" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Verify OTP
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

export default OtpVerification
