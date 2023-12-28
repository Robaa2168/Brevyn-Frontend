// Withdraw.js
import React, { useState } from 'react';

const Withdraw = () => {
    const [withdrawDetails, setWithdrawDetails] = useState({
        amount: '',
        bank: '',
        accountNo: ''
    });

    const handleChange = (e) => {
        setWithdrawDetails({ ...withdrawDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process the withdrawal
        console.log(withdrawDetails);
        // Ideally send the withdrawDetails to your backend or a payment API
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Withdraw Funds</h2>
            <p className='mb-2' style={{
    backgroundColor: 'rgba(255, 206, 86, 0.2)',
    borderColor: 'rgba(255, 206, 86, 1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '16px',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#424242' // adjust as needed
}}>For international transactions, please allow 1-3 days for the funds to reflect in your account</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Amount */}
    <div className="mb-2">
        <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-700">Amount</label>
        <input
            type="text"
            name="amount"
            value={withdrawDetails.amount}
            onChange={handleChange}
            className="w-full text-xs sm:text-xs md:text-sm p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter amount"
        />
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
            className="w-full border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white py-2 px-4 rounded transition duration-300"
        >
            Withdraw
        </button>
    </div>
</form>


        </div>
    );
};

export default Withdraw;
