// MyDonations.js
import React, { useState } from 'react';
// Assuming you have these Lottie animations and icons in your project, adjust imports as needed.
import Lottie from "lottie-react";
import cryingEmoji from "./lottie/crying-emoji.json";
import emptyAnimation from "./lottie/noLinks.json";


const MyDonations = () => {
    const [activeTab, setActiveTab] = useState('history');

    // Dummy data for donation history
    const donations = [
        { id: 1, type: 'incoming', name: 'John Doe', date: '2023-01-20', amount: 50, profilePic: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/613256_v9_bb.jpg' },
        { id: 1, type: 'incoming', name: 'John Doe', date: '2023-01-20', amount: 300, profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcIK01Ov3j_RFQWrwhtMDrNOQsitWDTxet9w&usqp=CAU' },
    ];

    const donationLinks = [
        // ... other links
    ];
  
     // Handlers for tab changes
     const showHistory = () => setActiveTab('history');
     const showLinks = () => setActiveTab('links');
 
     return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow">
            {/* Tabs for switching between history and links */}
            <div className="flex mb-4">
                <button
                    onClick={showHistory}
                    className={`flex-1 py-2 text-center ${activeTab === 'history' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-500'}`}
                >
                    History
                </button>
                <button
                    onClick={showLinks}
                    className={`flex-1 py-2 text-center ${activeTab === 'links' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-500'}`}
                >
                    Links
                </button>
            </div>

           {/* Render based on activeTab state */}
           {activeTab === 'history' && (
                <div>
                    {/* Incoming Donations List */}
                    {donations.length > 0 ? (
                        donations.map((donation, index) => (
                            <div key={index} className="flex items-center justify-between p-2 mt-3 border rounded">
                                <div className="flex items-center space-x-3">
                                    <img src={donation.profilePic} alt="Profile" className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-xs">{donation.name}</p>
                                        <p className="text-xs text-gray-500">{donation.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-xs text-green-500`}>${donation.amount}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center flex-col">
                            <Lottie animationData={cryingEmoji} style={{ width: 200, height: 200 }} />
                            <p className='text-gray-500 font-semibold mt-4'>No donations yet</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'links' && (
                <div>
                    {/* Donation Links List */}
{donationLinks.length > 0 ? (
    donationLinks.map((link, index) => (
        <div key={index} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg mb-2 shadow space-y-4 md:space-y-0">
            {/* Profile Picture and Link Details */}
            <div className="w-full md:flex md:items-center md:space-x-4 flex-1 min-w-0 text-center md:text-left">
                {/* Profile picture centered on small screens and left-aligned on larger screens */}
                <img src={link.profilePic} alt="Profile" className="w-10 h-10 rounded-full mx-auto md:mx-0" />
                {/* Adjustments for text */}
                <div className="flex-1 min-w-0">
                    {/* Title with ellipsis overflow */}
                    <h4 className="font-semibold text-sm sm:text-base truncate">{link.title}</h4>
                    {/* Description with ellipsis overflow (if needed) */}
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{link.description}</p>
                </div>
            </div>

            {/* Status and Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full md:w-auto">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${link.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                </span>
                <button onClick={() => {/* handle preview click */}} className="mt-2 sm:mt-0 sm:ml-3 text-xs md:text-sm border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors duration-300 py-2 px-4 rounded w-full md:w-auto">
                    View
                </button>
            </div>
        </div>
    ))
                    ) : (
                       <div className="flex justify-center items-center flex-col">
                            <Lottie animationData={emptyAnimation} style={{ width: 200, height: 200 }} />
                            <p className='text-gray-500 font-semibold mt-4'>No links created</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyDonations;