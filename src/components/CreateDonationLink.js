// CreateDonationLink.js
import React, { useState } from 'react';
import api from '../api';
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import { useUser } from "./context";

const CreateDonationLink = ({ setShowCreateLink }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCancel = () => {
        setShowCreateLink(false); // Set back to show the summary
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await api.post('/api/auth/create-link', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 201) {
                setIsSuccessful(true);
            } else {
                setError('Failed to generate donation link. Please try again.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg ">
            <h2 className="text-lg font-bold mb-4">Create a Donation Link</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
                    {error}
                </div>
            )}

            {!isSuccessful ? (
                <>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2 text-xs sm:text-xs">Title for the Donation</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter title"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-xs sm:text-xs">Target Amount ($)</label>
                            <input
                                type="number"
                                name="targetAmount"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter target amount"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-xs sm:text-xs">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Describe the purpose of the donation"
                            ></textarea>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto border border-emerald-500 text-xs text-emerald-500 px-4 py-2 rounded hover:bg-emerald-500 hover:text-white transition duration-300"
                            >
                                {isSubmitting ? 'Generating...' : 'Generate Link'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-full sm:w-auto border border-red-500 text-xs text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <div className="flex  flex-col items-center justify-center w-full p-2">
                    {/* Success Animations */}
                    <div className="relative  w-full h-64">
                        <Lottie animationData={successConfetti} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                        <Lottie animationData={successAnimation} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                    </div>
                    {/* Success Message */}
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Donation Link Created Successfully!</p>

                    <button
                        onClick={() => setShowCreateLink(false)}
                        className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateDonationLink;