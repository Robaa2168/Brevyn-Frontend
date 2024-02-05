import React, { useEffect, useState } from 'react';
import api from '../../api'; 
import { FaSpinner } from 'react-icons/fa';
import Confetti from 'react-confetti';
import Lottie from "lottie-react";
import loadingAnimation from '../lottie/loading.json'; // Adjust this path as needed
import noRecordsAnimation from '../lottie/noLinks.json'; // Add a Lottie for "No records found"
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useUser } from "../context";

const CurrencyDetail = ({ currencyId, onBack }) => {
    const { user } = useUser();
    const [currencyDetails, setCurrencyDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);


  useEffect(() => {
    const fetchCurrencyDetails = async () => {
      setIsLoading(true); // Ensure loading is set to true at the start of the request
      try {
        const response = await api.get(`/api/currencies/${currencyId}`, { // Ensure correct endpoint
          headers: {
            Authorization: `Bearer ${user.token}`, // Ensure you're passing the authorization token correctly
          },
        });
  
        if (response.status === 200) { // Check if the response is OK
          setCurrencyDetails(response.data); // Update state with the received data
        } else {
          // Handle responses that are not OK (e.g., 404 or 500 status codes)
          console.error("Failed to fetch currency details:", response.statusText);
          setCurrencyDetails(null); // Consider setting currencyDetails to null or an appropriate value
        }
      } catch (error) {
        console.error("Error fetching currency details:", error);
        setCurrencyDetails(null); // Ensure currencyDetails is handled in case of error
      } finally {
        setIsLoading(false); // Ensure loading is set to false at the end of the request, regardless of outcome
      }
    };
  
    fetchCurrencyDetails();
  }, [currencyId, user.token]); 
  

  const handleActivateCurrency = async () => {
    setIsActivating(true);
    try {
      // Adjust the URL to match your API's endpoint for activating by _id
      const response = await api.patch(`/api/currencies/activate/${currencyDetails._id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
  
      if (response.status === 200) {
        setError('');
        setCurrencyDetails({ ...currencyDetails, isActive: true });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 10000); // Clear confetti after 10 seconds
      } else {
        // Assuming the API returns a JSON response with an error message
        const errorData = await response.json(); // Adjust this line based on how your API structures error responses
        setError(errorData.message || 'Failed to activate currency.'); // Use the API's error message if available
      }
    } catch (error) {
      // If there's an error in making the request
      if (error.response) {
        setError(error.response?.data?.message|| `An error occurred while activating ${currencyDetails.currency} currency.`);
      } else {
        // For network errors or other issues where the response is not available
        setError(`An error occurred while activating ${currencyDetails.currency} currency.`);
      }
      console.error("Error activating currency:", error);
    } finally {
      setIsActivating(false);
    }
  };
  


  if (isLoading) {
    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md text-center ">
      <div className="flex flex-col items-center justify-center">
        <Lottie animationData={loadingAnimation} style={{ width: 150, height: 150 }} />
      </div>
      </div>
    );
  }

  if (!currencyDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Lottie animationData={noRecordsAnimation} style={{ width: 200, height: 200 }} />
        <p className="mt-4 text-lg">Currency details not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
        {showConfetti && <Confetti />}
        <div className="flex items-center mb-4">
    <button onClick={onBack} className="flex items-center justify-center p-2 text-emerald-600 hover:text-emerald-800 transition-colors duration-150 ease-in-out">
        <span className="inline-flex items-center justify-center p-2 mr-2 rounded-full border border-green-600 bg-green-100 hover:bg-green-200">
            <AiOutlineArrowLeft />
        </span>
        Back
    </button>
</div>


      <h2 className="text-lg font-bold mb-4">{currencyDetails?.currency} Currency  </h2>
      <div className="border p-4 rounded-lg text-xs">
      {error && (
                <div className="mb-4 p-4 text-xs bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}
        <p className="mb-2">Balance: {currencyDetails?.balance}</p>
        <p className="mb-2">
        Status: 
        <span 
            className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                currencyDetails?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
        >
            {currencyDetails?.isActive ? 'Active' : 'Inactive'}
        </span>
    </p>
        <p className="mb-2">Limit: {currencyDetails?.limit}</p>
        <p className="mb-2">Primary Account: {currencyDetails?.isPrimary ? 'Yes' : 'No'}</p>
        <button
  onClick={handleActivateCurrency}
  className="w-full md:w-auto mt-4 px-4 py-2 border border-emerald-500 text-emerald-500 rounded hover:bg-emerald-500 hover:text-white transition duration-150 ease-in-out flex justify-center items-center"
>
  {isActivating && (
    <FaSpinner className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" />
  )}
  {isActivating ? `Activating ${currencyDetails.currency}...` : `Activate ${currencyDetails.currency}`}
</button>



      </div>
      {
  !currencyDetails?.isActive && (
    <p style={{
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: '1px',
      borderStyle: 'solid',
      padding: '16px', // adjust as needed
      borderRadius: '4px', // adjust as needed
      fontSize: '12px', // adjust as needed
      color: '#424242',
      marginTop: '20px', // Adjust the margin-top value as needed
    }}>
      To activate {currencyDetails?.currency} currency, a fee of $10 ~ KES1600 will be charged. Please note that the funds used to pay this fee must be in the same currency as the one being activated.
    </p>
  )
}


    </div>
  );
};
export default CurrencyDetail;
