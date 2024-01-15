import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner, FaHeart, FaPaperclip, FaPaperPlane, FaStar, FaStarHalf } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const ReviewModal = ({ onClose, reviews, isLoading }) => {
    // Function to generate a placeholder for user avatar
    const getInitials = (firstName, lastName) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    // Function to display ratings with stars
    const RatingStars = ({ rating }) => {
        const totalStars = 5;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        const starElements = [];

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starElements.push(<FaStar key={i} className="text-yellow-400" />);
        }

        // Half star
        if (hasHalfStar) {
            starElements.push(<FaStarHalf key={fullStars} className="text-yellow-400" />);
        }

        // Empty stars
        for (let i = starElements.length; i < totalStars; i++) {
            starElements.push(<FaStar key={i} className="text-gray-400" />);
        }

        return <div className="flex items-center">{starElements}</div>;
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-600 bg-opacity-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <ToastContainer position="top-center" />
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full h-3/4">
                    {/* Modal Header */}
                    <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Reviews</span>
                        <button onClick={onClose} className="text-gray-700 hover:text-emerald-600 transition duration-150 focus:outline-none">
                            &times;
                        </button>
                    </div>

                    {/* Reviews List */}
                    <div className="px-4 py-3 overflow-y-auto custom-scrollbar" style={{ maxHeight: '40vh' }}>
                        {/* Loading Spinner */}
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <FaSpinner className="animate-spin" size={20} />
                            </div>
                        ) : reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="mb-3 border-b border-gray-200 pb-2">
                                    {/* Review Content */}
                                    <div className="flex space-x-2">
                                        {/* Placeholder for User Avatar */}
                                        <div className="flex-none">
                                            <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                                                {getInitials(review.firstName, review.lastName)}
                                            </span>
                                        </div>

                                        {/* Review Text and Metadata */}
                                        <div className="flex-grow text-xs sm:text-sm space-y-1">
                                            {/* Name and Text */}
                                            <div>
                                                <span className="font-semibold">{`${review.firstName} ${review.lastName}`}</span>
                                                <p className="text-gray-800">{review.reviewContent}</p>
                                            </div>

                                            {/* Rating Display */}
                                            <div className="text-gray-500">
                                                <RatingStars rating={review.rating} /> {/* Use RatingStars component */}
                                            </div>

                                            {/* Time Ago */}
                                            <div className="text-gray-500">
                                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No reviews yet.</p>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <FaPaperclip className="text-gray-500 cursor-pointer hidden sm:block" />
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 p-2 border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                        />
                        <button
                            type="submit"
                            className="bg-emerald-500 text-white p-2 rounded-lg focus:outline-none hover:bg-emerald-600"
                        >
                            <FaPaperPlane className="text-sm sm:text-base" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
