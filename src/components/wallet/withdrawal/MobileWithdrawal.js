import React, { useState } from 'react';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import successAnimation from "../../lottie/success-animation.json";
import successConfetti from '../../lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import api from '../../../api';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';

const MobileWithdrawal = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [withdrawDetails, setWithdrawDetails] = useState({
        amount: '',
        phoneNumber: '',
        provider: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleChange = (e) => {
        setWithdrawDetails({ ...withdrawDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await api.post('/api/transactions/withdraw/mobile', withdrawDetails, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.status === 201) {
                setSuccess(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 10000);
            } else {
                setError("Failed to process withdrawal. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during withdrawal.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg ">
              {showConfetti && <Confetti />}
            <h2 className="text-lg font-bold mb-2">Withdraw Funds via Mobile Money</h2>

            {success ? (
                <div className="flex flex-col items-center justify-center w-full p-4">
                    <div className="relative w-full h-64 md:h-96">
                        <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                        <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                    </div>
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Withdrawal Successful!</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10">
                        Done
                    </button>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="mb-4 p-4 text-xs sm:text-xs  bg-red-100 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <div className="mb-2">
                            <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={withdrawDetails.phoneNumber}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="provider" className="block mb-1 text-sm font-medium text-gray-700">Provider</label>
                            <input
                                type="text"
                                name="provider"
                                value={withdrawDetails.provider}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter your provider"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="tel"
                                name="amount"
                                value={withdrawDetails.amount}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter amount"
                            />
                        </div>
                        <div className="col-span-1">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex justify-center items-center w-full text-white py-2 px-4 rounded transition duration-300 ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                            >
                                {isSubmitting && <FaSpinner className="animate-spin mr-2" />}
                                Withdraw
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default MobileWithdrawal;
