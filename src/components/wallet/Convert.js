// Convert.js
import React, { useState } from 'react';

const Convert = () => {
    const [conversionDetails, setConversionDetails] = useState({
        usd: 0,
        impactPoints: 0,
        amount: '',
        isConvertingToUSD: true, // Determines conversion direction
    });

    const swapConversion = () => {
        setConversionDetails({
            ...conversionDetails,
            isConvertingToUSD: !conversionDetails.isConvertingToUSD
        });
    };

    const handleAmountChange = (e) => {
        setConversionDetails({ ...conversionDetails, amount: e.target.value });
    };

    const handleConvertSubmit = (e) => {
        e.preventDefault();
        // Implement conversion logic here
        console.log(`Converting: ${conversionDetails.amount}`);
        // Update usd or impactPoints based on isConvertingToUSD
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Convert Points</h2>
            <div className="flex flex-col items-center mb-4">
                <input
                    type="text"
                    readOnly
                    value={conversionDetails.isConvertingToUSD ? conversionDetails.impactPoints : conversionDetails.usd}
                    className="mb-2 p-2 border rounded text-xs md:text-sm w-full text-center bg-gray-100 cursor-not-allowed"
                    placeholder={conversionDetails.isConvertingToUSD ? "Impact Points" : "USD"}
                />
                <div
                    className="text-emerald-500 text-xl sm:text-2xl cursor-pointer"
                    onClick={swapConversion}
                >
                           {/* Convert Icon */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="text-emerald-500 text-xl sm:text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg>
             
                </div>
                <input
                    type="text"
                    readOnly
                    value={conversionDetails.isConvertingToUSD ? conversionDetails.usd : conversionDetails.impactPoints}
                    className="mt-2 p-2 border rounded text-xs md:text-sm w-full text-center bg-gray-100 cursor-not-allowed"
                    placeholder={conversionDetails.isConvertingToUSD ? "USD" : "Impact Points"}
                />
            </div>
            <input
                type="number"
                name="amount"
                value={conversionDetails.amount}
                onChange={handleAmountChange}
                className="mb-4 p-2 border rounded text-xs md:text-sm w-full"
                placeholder="Enter amount to convert"
            />
            <button
                type="submit"
                className="w-full border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white py-2 px-4 rounded transition duration-300"
            >
                Convert
            </button>
        </div>
    );
};

export default Convert;
