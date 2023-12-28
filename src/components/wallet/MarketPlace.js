// MarketPlace.js
import React, { useState } from 'react';
import { FaRegClock, FaRegStar, FaRegBuilding } from 'react-icons/fa';
import { HiOutlineShoppingBag } from "react-icons/hi";

const MarketPlace = () => {
    // Dummy data for marketplace offers
    const [offers, setOffers] = useState([
        {
            id: 1,
            username: 'SassyZingel394',
            paymentMethod: 'Bank Transfer',
            seenTime: '11 hours',
            transactionTime: '5 min',
            rate: '1 USD = 2 points',
            rateChange: '-3.4%',
            minPurchase: '50 points',
            maxPurchase: '1000 points',
            currency: 'COP'
        },
        // More offers...
    ]);

    const handleBuy = (offerId) => {
        // Placeholder for buy logic
        console.log(`Buying from offer with ID: ${offerId}`);
        // Here you would probably set up a redirect to a purchase page or open a modal
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
             <h2 className="text-lg font-bold mb-2">Market Place</h2>
        <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-md mb-4">
         
        <p className="text-yellow-700 text-xs">
        Direct deposits may not be available in certain countries. We suggest that users consider obtaining impact points through the Market Place where all sellers are verified and compliant with the rules ensuring a worry-free experience.
</p>

        </div>
            {offers.map((offer) => (
    <div key={offer.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-300 rounded-md space-y-4 sm:space-y-0">
        <div className="flex-grow flex flex-col sm:flex-row items-center sm:space-x-3 mb-3 sm:mb-0">
            <div className="text-green-600">
                <FaRegStar /> {/* Seller's rating icon */}
            </div>
            <div>
                <p className="font-semibold text-base sm:text-sm">{offer.username}</p>
                <p className="text-sm text-gray-500">
                    <FaRegBuilding className="inline mr-1" /> {/* Bank icon */}
                    {offer.paymentMethod}
                </p>
                <p className="text-sm text-gray-500">
                    <span className="inline-block h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                    Seen {offer.seenTime} ago
                </p>
            </div>
        </div>
        <div className="flex-grow mb-3 sm:mb-0">
            <div className="flex items-center space-x-1 text-sm">
                <FaRegClock /> {/* Transaction time icon */}
                <span>{offer.transactionTime}</span>
            </div>
            <p className="text-sm">{offer.rate}</p>
        </div>
        <div className="flex-grow mb-3 sm:mb-0">
            <p className="text-sm">Min purchase: {offer.minPurchase}</p>
            <p className="text-sm">Max purchase: {offer.maxPurchase}</p>
        </div>
        <button
            onClick={() => handleBuy(offer.id)}
            className="flex items-center justify-center text-sm text-emerald-600 border border-emerald-600 hover:bg-emerald-600 hover:text-white py-2 px-4 rounded transition-colors duration-200 ease-in-out w-full sm:w-auto"
        >
            Buy <HiOutlineShoppingBag className="ml-2" size={20} />
        </button>
    </div>
))}

        </div>
    );
};

export default MarketPlace;
