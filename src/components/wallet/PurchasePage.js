import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import { FaRegClock, FaShieldAlt, FaRegStar, FaCheck, FaCheckCircle, FaThumbsUp, FaThumbsDown, FaInfoCircle } from 'react-icons/fa';
import { HiOutlineExclamationCircle, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context";

const PurchasePage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [points, setPoints] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePointsChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 0) {
            setPoints(value);
        }
    };

    const handleBuyNowClick = async () => {
        // Check if points are not empty or zero
        if (!points || points <= 0) {
            toast.error("Please enter a valid amount of points to buy.");
            return; // Exit the function early
        }
    
        setLoading(true);
        try {
            const amount = points; // Assuming 1 point = 1 USD
            const response = await api.post('/api/trade/start', {
                points,
                amount
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });
    
            // Check response status and navigate with tradeId
            if (response.status === 200 || response.status === 201) {
                toast.success('Trade started successfully! Redirecting...');
                
                // Extract tradeId from the response
                const tradeId = response.data.tradeId;
    
                // Delay navigation to allow the user to read the toast message
                setTimeout(() => {
                    navigate(`/chat/${tradeId}`); // Navigate to chat with the tradeId
                }, 5000); // Adjust time as needed
    
            } else {
                throw new Error('Failed to initiate trade. Please try again.');
            }
        } catch (error) {
            toast.error('Error starting trade: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    



    return (
        <div className="bg-emerald-50 min-h-screen flex flex-col justify-center items-center pt-4 px-2 sm:px-4 pb-20">
            <ToastContainer position="top-center" />

            {/* Purchase form container */}
            <div className="max-w-4xl w-full p-4 bg-white rounded-lg border border-gray-300 mt-4">

                <div className="bg-emerald-300 text-white text-sm font-bold p-4 rounded-t-lg">
                    How many points do you want to Buy?
                </div>

                <div className="flex flex-col md:flex-row md:justify-between p-4 gap-4">
                    <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="points" className="text-xs font-semibold mb-2">I want</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="points"
                                placeholder="points"
                                className="p-2 pl-2 pr-10 border rounded text-xs sm:text-xs md:text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 w-full"
                                value={points}
                                onChange={handlePointsChange}
                            />
                            <span className="absolute inset-y-0 right-2 flex items-center text-gray-500 text-xs pointer-events-none">
                                points
                            </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-2">Enter points to get started</p>
                    </div>

                    <div className="flex flex-col w-full md:w-1/2">
                        <label htmlFor="amountToPay" className="text-xs font-semibold mb-2">I will pay</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="amountToPay"
                                placeholder="Amount"
                                readOnly  // Make this field read-only
                                className="p-2 pl-2 pr-10 border rounded text-xs sm:text-xs md:text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 w-full"
                                value={points} // The value is the same number of points (1 point = 1 USD)
                            />
                            <span className="absolute inset-y-0 right-2 flex items-center text-gray-500 text-xs pointer-events-none">
                                USD
                            </span>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col md:flex-row md:justify-between p-4 gap-4">
                    <div className="flex flex-col w-full">
                        <label htmlFor="tradePartnerBank" className="text-xs font-semibold mb-2 flex items-center">
                            Trade Partner’s Bank
                            <HiOutlineExclamationCircle className="ml-1 text-sm" />
                        </label>


                        <select
                            id="tradePartnerBank"
                            className="p-2 border rounded text-xs sm:text-xs md:text-sm  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500r"
                        >
                            <option value="equity">Equity</option>
                            {/* Add more options here */}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col p-4 gap-4">
                    <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4 mb-4">
                    <button
    onClick={handleBuyNowClick}
    disabled={loading}
    className={`w-full sm:w-auto border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white py-2 px-4 rounded transition duration-300 ${loading ? "bg-emerald-500 text-white" : ""
    }`}
>
    <div className="flex items-center justify-center"> 
        {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
        {loading ? "Starting Trade..." : "Start Trade"}
    </div>
</button>



                        <button className="border border-gray-300 text-gray-600 hover:bg-gray-300 hover:text-white py-2 px-4 rounded ">
                            Cancel
                        </button>
                    </div>
                    <div className="border-t border-gray-300 pt-4">
                        <p className="flex items-center justify-center text-gray-500 text-xs">
                            <FaShieldAlt className="mr-1" />
                            Secure escrow + Automated trade with Mc_Gold
                        </p>
                    </div>
                </div>
            </div>

            {/* offer about section */}
            <div className="max-w-4xl w-full bg-white p-4 border border-gray-300 my-4 rounded-lg">

                <div className="grid md:grid-cols-2 gap-4">
                    {/* About this offer */}
                    <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold text-emerald-600 mb-2">About this offer</h3>
                        <div className="flex items-center text-xs font-semibold space-x-1">
                            <FaRegStar className="text-yellow-500" />
                            <span>Seller rate:</span>
                            <span className="text-sm ml-1 flex items-center">
                                2% <HiOutlineChevronDown className="text-red-500" />
                            </span>
                        </div>
                        <div className="text-xs font-semibold flex items-center space-x-1">
                            <HiOutlineChevronDown className="text-green-500" />
                            <span>Min:</span>
                            <span>10 points</span>
                        </div>
                        <div className="text-xs font-semibold flex items-center space-x-1">
                            <HiOutlineChevronUp className="text-red-500" />
                            <span>Max:</span>
                            <span>1000 points</span>
                        </div>
                        <div className="flex items-center text-xs font-semibold space-x-1">
                            <FaRegClock className="text-gray-500" />
                            <span>Trade time limit:</span>
                            <span>30 min</span>
                        </div>
                    </div>




                    {/* About this buyer */}
                    <div className="bg-white border border-gray-300 rounded-lg p-4">
                        <h3 className=" font-semibold text-emerald-600 mb-2">About this seller</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center space-x-2">
                                <img src="https://www.volunteerforever.com/wp-content/uploads/2019/01/Cheap-Affordable-Volunteer-Programs-Header.jpg" alt="Buyer" className="w-12 h-12 rounded-full" /> {/* Adjusted image size */}
                                <div className="flex flex-col justify-between">
                                    <span className=" font-semibold">Mc_Gold</span>
                                    <div className="flex items-center text-sm text-gray-400">
                                        <FaCheckCircle className="text-green-500 mr-1" size="0.75em" />
                                        Verified
                                    </div>
                                    <span className="flex items-center text-gray-500 text-xs">
                                        <FaRegClock className="mr-1" />
                                        online
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-green-800 text-xs font-semibold mr-2 bg-green-50 border border-green-200 rounded-md py-1 px-2">
                                <FaThumbsUp className="text-green-500" />
                                <span className="ml-1">787</span>
                            </div>
                            <div className="flex items-center text-red-800 text-xs font-semibold bg-red-100 border border-red-200 rounded-md py-1 px-2">
                                <FaThumbsDown className="text-red-500" />
                                <span className="ml-1">0</span>
                            </div>
                        </div>
                        <div className="flex flex-col mt-2 space-y-1 lg:grid lg:grid-cols-2 lg:gap-4">
                            <div className="flex items-center">
                                <FaCheck className="text-green-500" />
                                <span className="ml-1">ID verified</span>
                            </div>
                            <div className="flex items-center">
                                <FaCheck className="text-green-500" />
                                <span className="ml-1">Email verified</span>
                            </div>
                            <div className="flex items-center">
                                <FaCheck className="text-green-500" />
                                <span className="ml-1">Phone verified</span>
                            </div>
                            <div className="flex items-center">
                                <FaCheck className="text-green-500" />
                                <span className="ml-1">Address verified</span>
                            </div>
                        </div>
                        {/* Average trade speed indicator, styled as a footer */}
                        <div className="mt-4 pt-4 border-t border-gray-300">
                            <div className="text-xs font-semibold flex flex-col ">
                                <div className="flex items-center">

                                    <span className='font-weight-normal text-gray-600 d-flex '>Average trade speed</span>
                                    <FaInfoCircle className="text-gray-400 ml-1" />
                                </div>
                                <div className="mt-3">
                                    <span className="text-xs font-semibold bg-green-50 border border-green-400 text-black-400 py-1 px-3 rounded-sm">
                                        Instant
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Offer terms */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 mt-4 lg:mt-6">
                    <h3 className="text-emerald-600 font-semibold mb-3 text-sm lg:text-base">Offer terms</h3>
                    <ul className="list-disc text-sm pl-6 lg:pl-8 space-y-2">
                        <li>Before a trade starts, the seller selects the bank account they'll receive payment to and the buyer selects the account they will send funds to.</li>
                        <li>When the seller is ready to start the trade, they'll share their bank account details with the buyer.</li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default PurchasePage;
