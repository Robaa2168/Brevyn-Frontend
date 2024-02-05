import React, { useState } from 'react';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import successAnimation from "../../lottie/success-animation.json";
import successConfetti from '../../lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import api from '../../../api'; // Adjust this path as needed
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';

const Deposit = ({ setActiveComponent }) => {
    const { user, login } = useUser();
    const navigate = useNavigate();
    const [depositDetails, setDepositDetails] = useState({
        amount: '',
        phoneNumber: '',
        currency: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setShowSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isPolling, setIsPolling] = useState(false);

    // Assuming the structure of user.accounts is [{ currency: 'USD', balance: 100 }, ...]
    const currencies = user?.accounts?.map(account => ({ currency: account.currency, balance: account.balance })) || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepositDetails({ ...depositDetails, [name]: value });
        setError(''); // Clear global error when any input changes
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await api.post('/api/deposits/deposit', {
                amount: parseFloat(depositDetails.amount),
                currency: depositDetails.currency,
                initiatorPhoneNumber: user?.phoneNumber,
                phoneNumber: depositDetails.phoneNumber,
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.data && response.status === 200) {
                setError(null);
                setSuccessMessage('STK sent, enter the PIN to complete the transaction.');

                setIsPolling(true);

                // Start polling for the deposit status
                const checkoutRequestId = response.data.CheckoutRequestID;
                const pollInterval = 5000;
                const maxRetries = 12;
                let retries = 0;

                const pollDepositStatus = setInterval(async () => {
                    try {
                        const depositResponse = await api.get(`/api/deposits/deposit/${checkoutRequestId}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        });

                        const deposit = depositResponse.data;
                        if (deposit.isSuccess) {
                            const response = await api.get('/api/auth/info', {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                },
                            });

                            if (response.status === 200) {
                                login({ ...user, ...response.data });
                            }
                            clearInterval(pollDepositStatus);
                            setIsSubmitting(false);
                            setIsPolling(false);
                            setIsPolling(false);
                            setSuccessMessage(null);
                            setShowConfetti(true);
                            setShowSuccess(true);
                            setTimeout(() => {
                                setShowSuccess(false);
                                setShowConfetti(false);
                                setActiveComponent('CurrenciesContainer');
                            }, 10000);
                        } else if (deposit.error && !deposit.isSuccess) {
                            clearInterval(pollDepositStatus);
                            setIsSubmitting(false);;
                            setIsPolling(false);
                            setError(deposit.error);
                            setSuccessMessage(null);
                            setShowConfetti(false)
                        }

                        retries++;
                        if (retries >= maxRetries) {
                            clearInterval(pollDepositStatus);
                            setIsSubmitting(false);;
                            setIsPolling(false); // set isPolling to false here
                            setError('Transaction timeout. Please try again.');
                            setSuccessMessage(null);
                        }
                    } catch (error) {
                        console.error('Error polling deposit status:', error);
                        clearInterval(pollDepositStatus);
                        setIsSubmitting(false);
                        setIsPolling(false); // set isPolling to false here
                        setError('Error checking deposit status. Please check deposit history and try again.');
                        setSuccessMessage(null);
                    }
                }, pollInterval);
            }
        } catch (error) {
            setIsSubmitting(false);
            setSuccessMessage(null);
            setError('An error occurred while processing the transaction.Check your connection');
            console.error('Error:', error);
        }
    };


    return (
        
        <div className="container mx-auto p-4 bg-white rounded-lg">
            {showConfetti && <Confetti />}

            {success ? (
                <div className="flex flex-col items-center justify-center w-full p-4">
                    <Lottie animationData={successConfetti} className="w-full h-64 md:h-96" />
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Deposit Successful!</p>
                    <button
                        onClick={() => setActiveComponent('CurrenciesContainer')}
                        className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm"
                    >
                        Done
                    </button>

                </div>
            ) : (
                <>
                    {error && (
                        <div className="mb-4 p-4 text-xs bg-red-100 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border-l-4 border-green-500">
                            {successMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        {/* Form fields for deposit: phoneNumber, amount, and currency */}
                        <div className="mb-2">
                            <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={depositDetails.phoneNumber}
                                onChange={handleChange}
                                className="w-full text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="phoneNumber"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="tel"
                                name="amount"
                                value={depositDetails.amount}
                                onChange={handleChange}
                                className="w-full text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter deposit amount"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="currency" className="block mb-1 text-sm font-medium text-gray-700">Currency</label>
                            <select
                                name="currency"
                                value={depositDetails.currency}
                                onChange={handleChange}
                                className="w-full text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="">Select Currency</option>
                                {currencies.map((currency, index) => (
                                    <option key={index} value={currency.currency}>{currency.currency}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex justify-center items-center w-full text-white bg-emerald-500 hover:bg-emerald-600 py-2 px-4 rounded transition duration-300"
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                'Deposit'
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Deposit;

