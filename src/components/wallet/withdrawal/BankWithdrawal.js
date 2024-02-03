import React, { useState } from 'react';
import Confetti from 'react-confetti';
import Lottie from 'lottie-react';
import successAnimation from "../../lottie/success-animation.json";
import successConfetti from '../../lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import api from '../../../api';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';

const BankWithdrawal = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [withdrawDetails, setWithdrawDetails] = useState({
        amount: '',
        bank: '',
        accountNo: '',
        beneficiaryName: '',
        routingNumber: '',
        currency: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    // Assume currencies are available for mobile withdrawal as well, or fetch them similarly
    const currencies = user?.accounts?.map(account => ({ currency: account.currency, balance: account.balance })) || [];
    const [inputError, setInputError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Adapted logic for currency validation
        if (name === 'amount' && !withdrawDetails.currency) {
            setInputError('Please select a currency first');
            return;
        } else {
            setInputError('');
        }

        const updatedDetails = { ...withdrawDetails, [name]: value };
        setWithdrawDetails(updatedDetails);

        setError('');

        if (name === 'currency') {
            setWithdrawDetails({ ...updatedDetails, amount: '' }); // Reset amount upon currency change

            if (updatedDetails.amount) {
                const selectedCurrencyBalance = currencies.find(c => c.currency === value)?.balance || 0;
                if (parseFloat(updatedDetails.amount) > selectedCurrencyBalance) {
                    setInputError(`The balance of ${value} is insufficient.`);
                } else {
                    setInputError('');
                }
            }
        } else if (name === 'amount') {
            const selectedCurrencyBalance = currencies.find(c => c.currency === updatedDetails.currency)?.balance || 0;
            if (parseFloat(value) > selectedCurrencyBalance) {
                setInputError(`The balance of ${updatedDetails.currency} is insufficient.`);
            } else {
                setInputError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await api.post('/api/transactions/withdraw/bank', withdrawDetails, {
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
            <h2 className="text-lg font-bold mb-2">Withdraw Funds</h2>


            {/* Conditionally render either the success animation or the form */}
            {success ? (

                <div className="flex flex-col items-center justify-center w-full p-4">

                    {/* Success Animations */}
                    <div className="relative w-full h-64 md:h-96">
                        {/* Confetti Animation */}
                        <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                        {/* Tick Animation */}
                        <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                    </div>
                    {/* Success Message */}
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Withdrawal Successfull!</p>

                    <button
                        onClick={() => navigate('/dashboard')} // Inline function for navigation
                        className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10">
                        Done
                    </button>

                </div>
            ) : (
                <>
                    <p className='mb-2' style={{
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        padding: '16px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: '#424242' // adjust as needed
                    }}>For international transactions, please allow 1-2 hours for the funds to reflect in your account</p>
                    {error && (
                        <div className="mb-4 p-4 text-xs sm:text-xs  bg-red-100 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="mb-2">
                            <label htmlFor="currency" className="block mb-1 text-sm font-medium text-gray-700">Currency</label>
                            <select
                                name="currency"
                                value={withdrawDetails.currency}
                                onChange={handleChange}
                                className="w-full text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                required>
                                <option value="">Select Currency</option>
                                {currencies.map((account, index) => (
                                    <option key={index} value={account.currency}>{account.currency}</option>
                                ))}
                            </select>
                        </div>
                        {/* Amount */}
                        <div className="mb-2">
                            <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="tel"
                                name="amount"
                                value={withdrawDetails.amount}
                                onChange={handleChange}
                                className={`w-full text-xs sm:text-xs md:text-sm p-2 border rounded focus:outline-none ${inputError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-emerald-500 focus:border-emerald-500'}`}
                                placeholder="Enter amount"
                            />
                            {inputError && <p className="text-xs text-red-500">{inputError}</p>}
                        </div>

                        {/* Bank */}
                        <div className="mb-2">
                            <label htmlFor="bank" className="block mb-1 text-sm font-medium text-gray-700">Bank</label>
                            <input
                                type="text"
                                name="bank"
                                value={withdrawDetails.bank}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm  p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter bank name"
                            />
                        </div>

                        {/* Beneficiary Name */}
                        <div className="mb-2">
                            <label htmlFor="beneficiaryName" className="block mb-1 text-sm font-medium text-gray-700">Beneficiary Name</label>
                            <input
                                type="text"
                                name="beneficiaryName"
                                value={withdrawDetails.beneficiaryName}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm  p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter beneficiary name"
                            />
                        </div>

                        {/* Account Number */}
                        <div className="mb-2">
                            <label htmlFor="accountNo" className="block mb-1 text-sm font-medium text-gray-700">Account Number</label>
                            <input
                                type="text"
                                name="accountNo"
                                value={withdrawDetails.accountNo}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm  p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter account number"
                            />
                        </div>

                        {/* Routing Number */}
                        <div className="mb-2">
                            <label htmlFor="routingNumber" className="block mb-1 text-sm font-medium text-gray-700">Routing Number</label>
                            <input
                                type="text"
                                name="routingNumber"
                                value={withdrawDetails.routingNumber}
                                onChange={handleChange}
                                className="w-full text-xs sm:text-xs md:text-sm  p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter routing number"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="col-span-1 lg:col-span-2">
                            <button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    inputError ||
                                    !withdrawDetails.bank ||
                                    !withdrawDetails.accountNo ||
                                    !withdrawDetails.routingNumber ||
                                    !withdrawDetails.currency
                                }
                                className={`flex justify-center items-center w-full text-white py-2 px-4 rounded transition duration-300 ${isSubmitting || inputError || !withdrawDetails.bank || !withdrawDetails.accountNo || !withdrawDetails.amount || !withdrawDetails.currency ? 'bg-gray-400' : 'bg-emerald-500 hover:bg-emerald-600'
                                    }`}
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

export default BankWithdrawal;
