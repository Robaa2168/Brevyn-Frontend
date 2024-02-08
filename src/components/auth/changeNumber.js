import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import api from '../../api';
import Lottie from 'lottie-react';
import { FaSpinner } from 'react-icons/fa';
import successAnimation from '../lottie/success-animation.json'; 
import successConfetti from '../lottie/success-confetti.json';

const ChangeNumber = () => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [newPhone, setNewPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(''); // Initialize error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locationState.state?.phoneNumber) {
      setError('Old phone number not loaded. Please try again.'); // Set error instead of using alert
      return;
    }
    setLoading(true);
    setError(''); // Clear any existing error messages
    try {
      const response = await api.post('/api/auth/change-phone', {
        oldPhone: locationState.state.phoneNumber,
        newPhone
      });

      if (response.status === 200) {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/phone-verify', { state: { phoneNumber: newPhone } });
        }, 5000);
      } else {
        setLoading(false);
        setError('Failed to change phone number. Please try again.'); // Set error for non-200 responses
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Failed to change phone number. Please try again.'); // Set error from catch block
    }
  };


  if (success) {
    return (

        <div className="flex flex-col items-center justify-center w-full p-4">
        <Confetti />
        <Lottie animationData={successConfetti} style={{ width: 200, height: 200 }} />
        <Lottie animationData={successAnimation} style={{ width: 200, height: 200 }} />
        <p className="text-lg font-semibold text-emerald-700 mt-4">Phone Number Changed Successfully!</p>
        <button  onClick={() => navigate('/phone-verify', { state: { phoneNumber: newPhone } })} className="mt-4 px-4 py-2 rounded bg-emerald-500 text-white">
            Done
        </button>
    </div>

    );
  }

  return (
    <div className=" min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <h2 className="text-lg sm:text-xl font-extrabold text-center text-gray-900 mb-4">Change Phone Number</h2>
        {error && (
            <div className="bg-red-100 text-xs mb-2 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={locationState.state?.phoneNumber || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            readOnly
          />
          <input
            type="tel"
            placeholder="Enter new phone number"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <div className="flex justify-between">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700">
              Back
            </button>
            <button type="submit" disabled={loading} className={`px-4 py-2 rounded-md ${loading ? 'bg-emerald-300' : 'bg-emerald-600'} text-white flex items-center justify-center`}>
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Updating...
          </>
        ) : 'Update'}
      </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeNumber;
