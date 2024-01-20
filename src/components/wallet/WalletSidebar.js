// WalletSidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../api';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../context';
import ReviewModal from './ReviewModal';
import {
    AiOutlineSwap,
    AiOutlineHistory,
    AiOutlineDollarCircle,
    AiOutlineShoppingCart,
    AiOutlineQuestionCircle,
    AiOutlineHome,
    AiOutlineStar
} from 'react-icons/ai';

const WalletSidebar = ({ changeComponent }) => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState('donationsSummary');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        // Only fetch reviews if the review modal is open
        if (!showReviewModal) return;
    
        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const headers = {};
                if (user && user.token) {
                    headers['Authorization'] = `Bearer ${user.token}`;
                }
    
                // Making a GET request to your API endpoint
                const response = await api.get('/api/reviews', { headers });
    
                // Check if the response is successful
                if (response.status === 200) {
                    setReviews(response.data);
                } else {
                    // If response is not successful, throw an error
                    throw new Error(response.statusText || "Unknown Error");
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error.message || error);
                toast.error(`Failed to fetch reviews: ${error.message || "Unknown error"}`);
            } finally {
                setIsLoadingReviews(false); 
            }
        };
    
        fetchReviews();
    }, [showReviewModal, user]);
    
    


    const handleReviewsClick = () => {
        setShowReviewModal(true); // Open the modal, triggering the useEffect hook to fetch reviews
    };


    const handleClick = (componentName) => {
        setActiveComponent(componentName);
        changeComponent(componentName);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mx-4 lg:mx-8 lg:rounded-none lg:h-full lg:w-64 mt-4 md:mt-8 lg:mt-16">
            <nav className="flex flex-col space-y-3">
                {/* Link back to dashboard */}
                <Link
                    to="/dashboard"
                    onClick={() => handleClick('donationsSummary')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'donationsSummary'
                        ? 'p-2 rounded-md text-emerald-700 bg-emerald-100'
                        : 'text-gray-700'
                        }`}
                >
                    <AiOutlineHome className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Home</span>
                </Link>

                {/* Withdraw */}
                <div
                    onClick={() => handleClick('withdraw')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'withdraw' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineDollarCircle className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Withdraw</span>
                </div>

                {/* Convert */}
                <div
                    onClick={() => handleClick('convert')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'convert' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineSwap className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Convert</span>
                </div>

                {/* History */}
                <div
                    onClick={() => handleClick('history')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'history' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineHistory className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Trade History</span>
                </div>

                {/* Deposit */}
                <div
                    onClick={() => handleClick('deposit')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'deposit' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineDollarCircle className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Deposit</span>
                </div>

                {/* Market Place */}
                <div
                    onClick={() => handleClick('marketPlace')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'marketPlace' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <div className="">
                        <AiOutlineShoppingCart className="text-xl sm:text-2xl" />
                    </div>
                    <span className="text-xs sm:text-sm ">Market Place</span>
                </div>
                <div
                    onClick={handleReviewsClick}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'reviews' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineStar className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Reviews</span>
                </div>

    {/* Help */}
    <div onClick={() => navigate('/help')} className="flex items-center space-x-3 cursor-pointer">
                    <AiOutlineQuestionCircle className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm pulse-dot-green">Help</span>
                </div>
            </nav>
              {/* Render the Review Modal */}
        {showReviewModal && (
            <ReviewModal
                onClose={() => setShowReviewModal(false)}
                reviews={reviews}
                isLoading={isLoadingReviews}
            />
        )}
        </div>
        
    );
};

export default WalletSidebar;
