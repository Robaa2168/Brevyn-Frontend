import React, { useState, useRef } from 'react';
import axios from 'axios'; // For image upload
import { FiX } from 'react-icons/fi';
import api from '../api';
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import { useUser } from "./context";

const CreateImpact = () => {
    const { user } = useUser();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        impactTitle: '',
        description: '',
        image: [],
        impressions: 0,
        likes: 0,
        views: 0,
        shares: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    // Validation errors
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // Validations
    const validateTitle = (title) => {
        if (title.length < 5) {
            setTitleError("Title is too short. Please provide a more descriptive title.");
        } else if (title.length > 50) {
            setTitleError("Title is too long. Please shorten it.");
        } else {
            setTitleError("");
        }
    };

    const validateDescription = (description) => {
        if (description.length < 50) {
            setDescriptionError("Description is too short. Please provide more details.");
        } else if (description.length > 500) {
            setDescriptionError("Description is too long. Please shorten it.");
        } else {
            setDescriptionError("");
        }
    };

    // Form handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));

        if (name === "description") {
            validateDescription(value);
        } else if (name === "impactTitle") {
            validateTitle(value);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setFormData({ ...formData, image: img });
        }
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
        data.append('file', formData.image);
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
            let image = [];
            if (formData.image) {
                const uploadedimage = await uploadImages();
                image = [uploadedimage];
            }
 
            const completeFormData = {
                ...formData,
                image,
            };

            const response = await api.post('/api/impacts/create', completeFormData ,{
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (response.status === 201) {
                setIsSuccessful(true);
            } else {
                setError('Failed to create impact. Please try again.'); 
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="container shadow-lg mx-auto p-4 bg-white rounded-lg max-w-2xl pb-20">

          <h2 className="text-lg font-bold text-emerald-600 mb-4">Create an Impact</h2>
    
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700">{error}</div>}
    
          {!isSuccessful ? (
            <form onSubmit={handleSubmit} >
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="impactTitle"
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter a title for your impact"
                  value={formData.impactTitle}
                  onChange={handleChange}
                />
                {titleError && <p className="mt-2 text-sm text-red-600">{titleError}</p>}
              </div>
    
        
    
              {/* Additional Fields */}
              <div>
                <label htmlFor="impressions" className="block text-sm font-medium text-gray-700">
                  Impressions
                </label>
                <input
                  type="tel"
                  name="impressions"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.impressions}
                  onChange={handleChange}
                />
              </div>
    
              <div>
                <label htmlFor="likes" className="block text-sm font-medium text-gray-700">
                  Likes
                </label>
                <input
                  type="tel"
                  name="likes"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.likes}
                  onChange={handleChange}
                />
              </div>
    
              <div>
                <label htmlFor="views" className="block text-sm font-medium text-gray-700">
                views
                </label>
                <input
                  type="tel"
                  name="views"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.views}
                  onChange={handleChange}
                />
              </div>
    
              <div>
                <label htmlFor="shares" className="block text-sm font-medium text-gray-700">
                  Shares
                </label>
                <input
                  type="tel"
                  name="shares"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.shares}
                  onChange={handleChange}
                />
              </div>
              </div>
                    {/* Description Input */}
                    <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Provide a detailed description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {descriptionError && <p className="mt-2 text-sm text-red-600">{descriptionError}</p>}
              </div>
    
              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full border py-2 px-4 rounded transition duration-300 ${
                    isSubmitting
                      ? 'bg-emerald-500 text-white'
                      : 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Create Impact'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center w-full p-4">
              {/* Success Animations */}
              <div className="relative w-full h-64 md:h-96">
                {/* Confetti Animation */}
                <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                {/* Tick Animation */}
                <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
              </div>
              {/* Success Message */}
              <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Impact Created Successfully!</p>
    
              <button
                className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10"
              >
                Done
              </button>
            </div>
          )}
        </div>
      );
    };
    
    export default CreateImpact;