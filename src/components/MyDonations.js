// MyDonations.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import cryingEmoji from "./lottie/crying-emoji.json";
import emptyAnimation from "./lottie/noLinks.json";
import loadingAnimation from './lottie/loading.json';
import api from '../api'; // update this path to your api configuration
import { useUser } from './context';


// Helper function for date formatting
const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert to Date object
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }); // Output in "23 Dec 2022" format
};


const MyDonations = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [donationLinks, setDonationLinks] = useState([]);
    const [activeTab, setActiveTab] = useState('history');
    const [isLoading, setIsLoading] = useState(false);
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchDonationLinks = async () => {
            setIsLoading(true);
            try {
                // Replace '/donation-links' with your actual endpoint
                const response = await api.get('/api/donations/user-links', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                console.log(response.data)
                setDonationLinks(response.data);
            } catch (error) {
                console.error("Error fetching donation links: ", error);
                // Optionally, handle errors here (e.g., set error messages, log errors, etc.)
            }
            setIsLoading(false);
        };

        fetchDonationLinks();
    }, [user.token]); // Rerun the effect if user token changes


    useEffect(() => {
        const fetchDonations = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/donations/user-donations', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                console.log("Donations:", response.data);
                setDonations(response.data);
            } catch (error) {
                console.error("Error fetching donations: ", error);
                // Handle errors appropriately
            }
            setIsLoading(false);
        };

        fetchDonations();
    }, [user.token]);

    // Handlers for tab changes
    const showHistory = () => setActiveTab('history');
    const showLinks = () => setActiveTab('links');

    const viewDonationLink = (linkId) => {
        navigate(`/donation-link/${linkId}`);
    };

    // Truncate function
    const truncate = (text, length) => {
        return text.length > length ? `${text.substring(0, length)}...` : text;
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow flex flex-col flex-grow"> {/* Added flex-grow and flex flex-col */}
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
                    {donations.length > 0 ? (
                        donations.map((donation, index) => (
                            <div key={index} className="flex items-center justify-between p-2 mt-3 border rounded">
                                <div className="flex items-center space-x-3">
                                    {/* Replace image with a div containing the first letter of the donor's name */}
                                    <div className="flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-200 text-white shadow-lg">
                                        <span className="text-xl font-bold">{donation.firstName.charAt(0)}</span>
                                    </div>


                                    <div>
                                        <p className="font-semibold text-xs">{donation.firstName}</p>
                                        <p className="text-xs text-gray-500">{`${formatDate(donation.date)} · ${donation.paymentStatus}`}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-xs text-green-500`}>+${donation.amount}</span>
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
                    {isLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                        </div>
                    ) : donationLinks.length > 0 ? (
                        donationLinks.map((link, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg mb-2 shadow space-y-4 md:space-y-0">
                                {/* Profile Picture and Link Details */}
                                <div className="w-full md:flex md:items-center md:space-x-4 flex-1 min-w-0 text-center md:text-left">
                                    {/* Profile picture centered on small screens and left-aligned on larger screens */}
                                    <img src={link.image} alt="Profile" className="w-10 h-10 rounded-full mx-auto md:mx-0" />
                                    {/* Adjustments for text */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm sm:text-base truncate">{truncate(link.title, 50)}</h4>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate w-full max-w-full">{truncate(link.description, 100)}</p>
                                    </div>
                                </div>

                                {/* Status and Action */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-center w-full md:w-auto text-center">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mb-2 sm:mb-0 ${link.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                                    </span>
                                    <button
                                        onClick={() => viewDonationLink(link._id)}
                                        className="mt-2 sm:mt-0 sm:ml-3 text-xs md:text-sm border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors duration-300 py-1 px-3 rounded w-full md:w-auto"
                                    >
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