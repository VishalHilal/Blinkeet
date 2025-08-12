import React from 'react';
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider';

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { fetchAddress } = useGlobalContext();

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                if (close) {
                    close();
                    reset();
                    fetchAddress();
                }
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-start overflow-y-auto pt-10 px-4 font-sans'>
            <div className='bg-white w-full max-w-lg rounded-xl shadow-xl p-6 sm:p-8 relative animate-fadeInUp'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-bold text-gray-800'>Add Address</h2>
                    <button onClick={close} className='text-gray-600 hover:text-red-500 transition'>
                        <IoClose size={28} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='grid gap-5'>

                    {/* Address Line */}
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Address Line</label>
                        <input
                            type="text"
                            placeholder="123, Street Name"
                            className={`w-full p-3 rounded-md border text-sm focus:outline-none transition ${errors.addressline ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-100'}`}
                            {...register("addressline", {
                                required: "Address is required",
                                minLength: { value: 5, message: "Min 5 characters" },
                                maxLength: { value: 100, message: "Max 100 characters" },
                            })}
                        />
                        {errors.addressline && <p className='text-sm text-red-600 mt-1'>{errors.addressline.message}</p>}
                    </div>

                    {/* City */}
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>City</label>
                        <input
                            type="text"
                            placeholder="City name"
                            className={`w-full p-3 rounded-md border text-sm focus:outline-none transition ${errors.city ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-100'}`}
                            {...register("city", {
                                required: "City is required",
                                pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces" },
                                minLength: { value: 2, message: "Min 2 characters" },
                            })}
                        />
                        {errors.city && <p className='text-sm text-red-600 mt-1'>{errors.city.message}</p>}
                    </div>

                    {/* State */}
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>State</label>
                        <input
                            type="text"
                            placeholder="State name"
                            className={`w-full p-3 rounded-md border text-sm focus:outline-none transition ${errors.state ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-100'}`}
                            {...register("state", {
                                required: "State is required",
                                pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces" },
                                minLength: { value: 2, message: "Min 2 characters" },
                            })}
                        />
                        {errors.state && <p className='text-sm text-red-600 mt-1'>{errors.state.message}</p>}
                    </div>

                    {/* Pincode */}
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Pincode</label>
                        <input
                            type="text"
                            placeholder="6-digit pincode"
                            className={`w-full p-3 rounded-md border text-sm focus:outline-none transition ${errors.pincode ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-100'}`}
                            {...register("pincode", {
                                required: "Pincode is required",
                                pattern: { value: /^[0-9]{6}$/, message: "Exactly 6 digits" },
                            })}
                        />
                        {errors.pincode && <p className='text-sm text-red-600 mt-1'>{errors.pincode.message}</p>}
                    </div>

                    {/* Country */}
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Country</label>
                        <input
                            type="text"
                            placeholder="Country name"
                            className={`w-full p-3 rounded-md border text-sm focus:outline-none transition ${errors.country ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-100'}`}
                            {...register("country", {
                                required: "Country is required",
                                pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces" },
                                minLength: { value: 2, message: "Min 2 characters" },
                            })}
                        />
                        {errors.country && <p className='text-sm text-red-600 mt-1'>{errors.country.message}</p>}
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-1'>Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="10-digit number"
                            className={`w-full p-3 rounded-md border text-sm focus:outline-none transition ${errors.mobile ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-gray-300 bg-gray-50 focus:ring-2 focus:ring-green-100'}`}
                            {...register("mobile", {
                                required: "Mobile number is required",
                                pattern: { value: /^[6-9]\d{9}$/, message: "Must start with 6-9 and be 10 digits" },
                            })}
                        />
                        {errors.mobile && <p className='text-sm text-red-600 mt-1'>{errors.mobile.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Save Address
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AddAddress;
