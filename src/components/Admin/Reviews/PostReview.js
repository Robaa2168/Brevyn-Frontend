import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import api from '../../../api';

const PostReview = () => {
    const [formData, setFormData] = useState({ reviewContent: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');
    
        try {
            const response = await api.post('/api/reviews/post-review', { reviewContent: formData.reviewContent });
    
            if (response.status === 201) {
                setShowSuccess(true);
                // You can handle the success action here
            } else {
                throw new Error(response.data.message || 'An error occurred while posting the review.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDone = () => {
        setShowSuccess(false);
        setFormData({ reviewContent: '' }); // Reset the form
    };
    
    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
            {error && (
                <div className="mb-4 p-4 text-xs sm:text-xs bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}
            {showSuccess ? (
                <div className="flex flex-col items-center justify-center w-full p-4">
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Review Posted Successfully!</p>
                    <button onClick={handleDone} className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm">
                        Done
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="reviewContent" className="block text-sm mb-2 font-medium text-gray-700">Review Content</label>
                        <textarea
                            name="reviewContent"
                            id="reviewContent"
                            value={formData.reviewContent}
                            onChange={handleChange}
                            rows="4"
                            className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            type="submit"
                            disabled={!formData.reviewContent || isSubmitting}
                            className="text-xs sm:text-sm px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            {isSubmitting ? <FaSpinner className="animate-spin" /> : "Post Review"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PostReview;
