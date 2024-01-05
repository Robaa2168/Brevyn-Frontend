// ChangePassword.js
import React, { useState } from 'react';
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { FaSpinner } from 'react-icons/fa';
import api from '../api';
import { useUser } from "./context";

const ChangePassword = () => {
  const { user, login } = useUser();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    const userToken = user?.token;

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Call the API to change the password
      const response = await api.post('/api/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (response.status === 200) {
        // Handle success
        setSuccess(true);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        // Handle any errors that aren't thrown
        setError(response.data.message || "An error occurred while changing the password.");
      }
    } catch (err) {
      // This will catch any error response from the server
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      {success ? (
        <div className="flex flex-col items-center justify-center w-full p-4">
          {/* Success Animations */}
          <div className="relative w-full h-64 md:h-96">
            {/* Confetti Animation */}
            <Lottie animationData={successConfetti} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            {/* Tick Animation */}
            <Lottie animationData={successAnimation} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </div>
          {/* Success Message */}
          <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Password Changed Successfully!</p>

          <button
            className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10">
            Done
          </button>

        </div>
      ) : (
        <>
          <h2 className="text-lg sm:text-xs font-bold mb-4">Change Password</h2>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 text-xs sm:text-xs  bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="text-xs sm:text-xs block mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="text-xs sm:text-xs block mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-xs sm:text-xs block mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded transition duration-300 text-xs sm:text-xs"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" /> Changing...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChangePassword;