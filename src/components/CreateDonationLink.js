// CreateDonationLink.js
import React, { useState, useRef } from 'react';
import api from '../api';
import axios from 'axios'; // For image upload
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { FaCopy } from 'react-icons/fa';
import { useUser } from "./context";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateDonationLink = ({ setShowCreateLink }) => {
    const { user } = useUser();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        description: '',
        image: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [descriptionError, setDescriptionError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [uniqueIdentifier, setUniqueIdentifier] = useState('');

    const validateTitle = (title) => {
        if (title.length < 5) {
            setTitleError("Title is too short. Please provide a more descriptive title.");
        } else if (title.length > 50) {
            setTitleError("Title is too long. Please shorten it.");
        } else {
            setTitleError(""); // No error
        }
    };

    const validateAmount = (amount) => {
        const numAmount = parseInt(amount);
        if (numAmount < 1000) {
            setAmountError("Amount is too low. The minimum is $1000.");
        } else if (numAmount > 3000) {
            setAmountError("Amount is too high. The maximum is $3000.");
        } else {
            setAmountError(""); // No error
        }
    };


    const validateDescription = (desc) => {
        if (desc.length < 50) {
            setDescriptionError("Description is too short. Please provide more details.");
        } else if (desc.length > 500) {
            setDescriptionError("Description is too long. Please shorten it.");
        } else {
            setDescriptionError(""); // No error
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    
        if (name === "description") {
            validateDescription(value);
        } else if (name === "title") {
            validateTitle(value);
        } else if (name === "targetAmount") {
            validateAmount(value);
        }
    };
    

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setFormData({ ...formData, image: img });
        }
    };

    const handleCancel = () => {
        setShowCreateLink(false);
    };


    const removeImage = (e) => {
        e.preventDefault();
        setFormData(prevformData => ({
            ...prevformData,
            image: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImages = async () => {
        const data = new FormData();
        data.append('file', formData.image); // corrected from setFormData.image to formData.image
        data.append('upload_preset', 'ml_default');
        data.append('cloud_name', 'dx6jw8k0m');
    
        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dx6jw8k0m/image/upload', data);
            return response.data.secure_url; // Return a single URL
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Handle image upload
            let imageUrl = '';
            if (formData.image) { // corrected from setFormData.image to formData.image
                imageUrl = await uploadImages(formData.image); // ensure you pass the image file correctly
            }

            // Combine form data and imageUrl
            const completeFormData = {
                ...formData,
                image: imageUrl,
            };

            // Replace URL and headers as necessary for your API
            const response = await api.post('/api/donations/create-link', completeFormData, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if (response.status === 201) {
                setUniqueIdentifier(response.data.link.uniqueIdentifier);
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

    const handleCopyClick = () => {
        const donationUrl = `https://verdantcharity.org/donate/${uniqueIdentifier}`;
        navigator.clipboard.writeText(donationUrl)
            .then(() => {
                toast.success("Copied to clipboard successfully!");
            })
            .catch(() => {
                toast.error("Failed to copy!");
            });
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg ">
            <h2 className="text-sm sm:text-lg font-bold mb-4">Create a Donation Link</h2>


            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
                    {error}
                </div>
            )}

            {!isSuccessful ? (
                <>
                    <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                    <label htmlFor="image" className="block text-emerald-700 text-xs sm:text-sm  font-bold mb-2 w-full">
                            <label htmlFor="image-upload" className="block text-emerald-700 text-xs sm:text-sm  font-bold mb-2 w-full">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="mt-2 block text-xs sm:text-sm  font-medium text-gray-900">
                                        upload picture
                                    </span>
                                    <input
                                        ref={fileInputRef} // Attach the ref here
                                        id="image-upload"
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </label>
                        </label>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-start items-center w-full">
                            {formData.image instanceof File && (
                                <div className="flex flex-col items-center mr-4 mb-4">
                                    <img src={URL.createObjectURL(formData.image)} alt="User Profile" className="w-16 h-16 object-cover rounded-md" />
                                    <button onClick={(e) => removeImage(e)} className="mt-2 text-red-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
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
                    {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
                </div>

                {/* Target Amount Field */}
                <div className="mb-4">
                    <label className="block mb-2 text-xs sm:text-xs">Target Amount ($)</label>
                    <input
                        type="tel"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter target amount"
                    />
                    {amountError && <p className="text-red-500 text-xs mt-1">{amountError}</p>}
                </div>

                        <div className="mb-4">
                    <label className="block mb-2 text-xs sm:text-xs">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 border rounded text-xs sm:text-xs focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Describe the purpose of the donation"
                    ></textarea>
                    {descriptionError && <p className="text-red-500 text-xs mt-1">{descriptionError}</p>}
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
                    <ToastContainer />
                    {/* Success Animations */}
                    <div className="relative  w-full h-64">
                        <Lottie animationData={successConfetti} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                        <Lottie animationData={successAnimation} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                    </div>
                    {/* Success Message */}
                    <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Donation Link Created Successfully!</p>

                    <button
                onClick={handleCopyClick}
                className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10 flex items-center justify-center"
            >
                <FaCopy className="mr-2" /> Copy Link
            </button>
                </div>
            )}
        </div>
    );
};

export default CreateDonationLink;