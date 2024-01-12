// EditProfile.js
import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import { useUser } from "./context";
import api from '../api'; // make sure this is correctly set up to handle API calls

const EditProfile = ({ initialData, onCancel }) => {
  const { user, login } = useUser();
  const [formData, setFormData] = useState(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  // Detect changes in formData
  useEffect(() => {
    setIsDataChanged(Object.keys(initialData).some(key => formData[key] !== initialData[key]));
  }, [formData, initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Construct a payload with only the fields that have changed
    const payload = Object.keys(formData).reduce((acc, key) => {
      if (initialData[key] !== formData[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    try {
      const response = await api.patch('/api/auth/edit-kyc', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }
      });

      // Assuming the server sends a 200 OK for successful operations
      if (response.status === 200) {
        setShowSuccess(true);
        login({ ...user, primaryInfo: response.data.primaryInfo });
      } else {
        // If the server response is not 200, throw an error with the server's message
        throw new Error(response.data.message || "An error occurred while updating the data.");
      }
    } catch (error) {
      // Check if the error response has data and a message, else use a generic error message
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDone = () => {
    setShowSuccess(false);
    onCancel();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 text-xs sm:text-xs  bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      {showSuccess ? (
        <div className="flex flex-col items-center justify-center w-full p-4">
          {/* Success Animations */}
          <div className="relative w-full h-64 md:h-64">
            {/* Confetti Animation */}
            <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            {/* Tick Animation */}
            <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </div>
          {/* Success Message */}
          <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">KYC Updated Successfully!</p>
          <button onClick={handleDone} className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm mb-2 font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={formData.dob || ''}
              onChange={handleChange}
              className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm mb-2 font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3  border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3  border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* ID Number Field */}
          <div>
            <label htmlFor="idNumber" className="block text-sm mb-2 font-medium text-gray-700">ID Number</label>
            <input
              type="text"
              name="idNumber"
              id="idNumber"
              value={formData.idNumber || ''}
              onChange={handleChange}
              className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Town Field */}
          <div>
            <label htmlFor="town" className="block text-sm mb-2 font-medium text-gray-700">Town</label>
            <input
              type="text"
              name="town"
              id="town"
              value={formData.town || ''}
              onChange={handleChange}
              className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3  border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Country Field */}
          <div>
            <label htmlFor="country" className="block text-sm mb-2 font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country || ''}
              onChange={handleChange}
              className="text-xs sm:text-sm block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          {/* Submit and Cancel buttons */}
          <div className="md:col-span-2 flex flex-col md:flex-row justify-end mt-4 space-y-2 md:space-y-0 md:space-x-2">
            <button
              type="submit"
              // disabled={!isDataChanged || isSubmitting}
              disabled
              className="text-xs sm:text-sm px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 w-full md:w-auto"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="text-xs sm:text-sm px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 w-full md:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProfile;