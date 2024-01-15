import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const EditReview = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const { reviewId } = useParams(); // Extract the reviewId from the URL parameter
    const [reviewData, setReviewData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await api.get(`/api/reviews/${reviewId}`);
                if (response.status === 200) {
                    setReviewData(response.data);
                    setFormData(response.data); // Set the fetched data to formData state
                } else {
                    throw new Error('Failed to fetch review data');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviewData();
    }, [reviewId]);


    useEffect(() => {
        setIsDataChanged(Object.keys(formData).some(key => formData[key] !== reviewData[key]));
    }, [formData, reviewData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        const payload = Object.keys(formData).reduce((acc, key) => {
            if (reviewData[key] !== formData[key]) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});


        try {
            const response = await api.patch(`/api/reviews/${reviewId}`, payload);

            if (response.status === 200) {
               navigate('/ReviewList')
            } else {
                throw new Error(response.data.message || "An error occurred while updating the review.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDone = () => {
        setShowSuccess(false);
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
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Review Updated Successfully!</p>
                    <button onClick={handleDone} className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm">
                        Done
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm mb-2 font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName || ''}
                            onChange={handleChange}
                            className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm mb-2 font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName || ''}
                            onChange={handleChange}
                            className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="reviewContent" className="block text-sm mb-2 font-medium text-gray-700">Review Content</label>
                        <textarea
                            name="reviewContent"
                            id="reviewContent"
                            value={formData.reviewContent || ''}
                            onChange={handleChange}
                            rows="4"
                            className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="rating" className="block text-sm mb-2 font-medium text-gray-700">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            id="rating"
                            value={formData.rating || ''}
                            onChange={handleChange}
                            min="1"
                            max="5"
                            className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="createdAt" className="block text-sm mb-2 font-medium text-gray-700">Created At</label>
                        <input
                            type="date"
                            name="createdAt"
                            id="createdAt"
                            value={formData.createdAt ? formData.createdAt.split('T')[0] : ''} // format the date to YYYY-MM-DD
                            onChange={handleChange}
                            className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>


                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            type="submit"
                            disabled={!isDataChanged || isSubmitting}
                            className="text-xs sm:text-sm px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            {isSubmitting ? <FaSpinner className="animate-spin" /> : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={handleDone}
                            className="text-xs sm:text-sm px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditReview;
