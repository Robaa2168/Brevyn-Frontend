//kyc.js

import React, { useState } from 'react';
import api from '../api';
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import { useUser } from "./context";

const Kyc = () => {
    const { user, login } = useUser();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const [kycDetails, setKycDetails] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        town: '',
        country: '',
        dob: '',
        idNumber: ''
    });



    const handleChange = (e) => {
        setKycDetails({ ...kycDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSuccessful(false);
        setIsSubmitting(true);

        const userToken = user?.token;
        console.log(userToken)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        };

        try {
            const response = await api.post('/api/auth/submit-kyc', kycDetails, config);
            if (response.status === 201) {
                login({ ...user, primaryInfo: response.data.primaryInfo });
                setIsSuccessful(true);
                console.log('KYC Data submitted successfully:', response.data);
            } else {
                setError('Unexpected response from the server. Please try again.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit KYC data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">KYC Verification</h2>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            {!isSuccessful ? (
                <>
                    {/* Friendly reminder message */}
                    <div className="mb-3 rounded" style={{
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        padding: '16px', // adjust as needed
                        borderRadius: '4px', // adjust as needed
                        fontSize: '14px', // adjust as needed
                        color: '#424242' // adjust as needed
                    }}>
                        <p className="text-yellow-800">Please take a moment to complete these necessary details to continue creating your donation link. We appreciate your cooperation and patience!</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Please fill in the information below to complete your KYC verification.</p>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={kycDetails.firstName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter first name"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={kycDetails.lastName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter last name"
                            />
                        </div>

                        {/* Phone */}
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={kycDetails.phone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter phone number"
                            />
                        </div>
                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={kycDetails.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter email address"
                            />
                        </div>


                        {/* Date of Birth */}
                        <div className="mb-4">
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={kycDetails.dob}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        {/* ID Number */}
                        <div className="mb-4">
                            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">ID Number</label>
                            <input
                                type="text"
                                name="idNumber"
                                value={kycDetails.idNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter ID number"
                            />
                        </div>
                        {/* Town */}
                        <div className="mb-4">
                            <label htmlFor="town" className="block text-sm font-medium text-gray-700">Nearest Town</label>
                            <input
                                type="text"
                                name="town"
                                value={kycDetails.town}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Nearest Town"
                            />
                        </div>
                        {/* Country */}
                        <div className="mb-4">
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={kycDetails.country}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter country"
                            />
                        </div>
                        {/* Submit Button */}
                        <div className="col-span-1 md:col-span-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full border py-2 px-4 rounded transition duration-300 ${isSubmitting ? 'bg-emerald-500 text-white' : 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin inline mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit KYC'
                                )}
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center w-full p-4">
                    {/* Success Animations */}
                    <div className="relative w-full h-64 md:h-96">
                        {/* Confetti Animation */}
                        <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                        {/* Tick Animation */}
                        <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                    </div>
                    {/* Success Message */}
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">KYC Submitted Successfully!</p>

                    <button
                        className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10">
                        Done
                    </button>

                </div>

            )}
        </div>

    );
};

export default Kyc;