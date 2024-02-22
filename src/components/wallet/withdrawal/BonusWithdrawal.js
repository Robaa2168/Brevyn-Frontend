import React, { useState } from 'react';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import successAnimation from "../../lottie/success-animation.json";
import successConfetti from '../../lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import { HiOutlineDownload } from "react-icons/hi";
import api from '../../../api';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';

const BonusWithdrawal = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    // Simplify the initial state as currency and provider are fixed
    const [withdrawDetails, setWithdrawDetails] = useState({
        amount: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [inputError, setInputError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWithdrawDetails({ ...withdrawDetails, [name]: value });
        setError('');

        // Check if amount is above the user's bonus balance
        if (name === 'amount') {
            if (parseFloat(value) > user?.balance) {
                setInputError('Insufficient bonus funds.');
            } else {
                setInputError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputError || !withdrawDetails.amount) {
            setError('Please fill in all fields correctly.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const response = await api.post('/api/transactions/withdraw/bonus', {
                ...withdrawDetails,
                currency: 'KES',
                provider: 'Safaricom',
                phoneNumber: `${user?.phoneNumber}`
            }, {
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
            <h2 className="text-lg font-bold mb-4">Bonus Withdrawal</h2>

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
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={user?.phoneNumber}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={withdrawDetails.amount}
                                onChange={handleChange}
                                className={`w-full text-xs sm:text-xs md:text-sm p-2 border rounded focus:outline-none ${inputError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-emerald-500 focus:border-emerald-500'}`}
                                placeholder="Enter amount"
                            />
                            {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
                        </div>
                        <div className='text-xs'>Total Bonus Balance: {user?.balance}</div>
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                inputError ||
                                !withdrawDetails.amount
                            }
                            className={`flex justify-center items-center w-full text-white py-2 px-4 mt-3 rounded transition duration-300 ${isSubmitting || inputError || !withdrawDetails.amount  ? 'bg-gray-400' : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Initiating withdrawal...
                                </>
                            ) : (
                                <>
                                    <HiOutlineDownload className="mr-2" />
                                    Withdraw Bonus
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default BonusWithdrawal;