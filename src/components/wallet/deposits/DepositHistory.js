import React, { useEffect, useState } from 'react';
import api from '../../../api'; // Update this import to match your file structure
import Lottie from 'lottie-react';
import loadingAnimation from '../../lottie/loading.json'; // Update this path as needed
import noRecordsAnimation from '../../lottie/noLinks.json'; // Update this path as needed
import { useUser } from '../../context'; // Update this import to match your context location
import { AiOutlineInfoCircle } from 'react-icons/ai'; // Importing an icon for the view details button

const DepositHistory = ({ onViewDetails }) => {
  const { user } = useUser();
  const [deposits, setDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) {
      return;
    }

    const fetchDeposits = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/deposits/deposits/', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.status === 200 && Array.isArray(response.data)) {
          setDeposits(response.data);
        } else {
          setDeposits([]);
        }
      } catch (error) {
        console.error("Error fetching deposit history:", error);
        setDeposits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeposits();
  }, [user]);

  const handleViewDetails = (currencyId) => {
    onViewDetails(currencyId);
};

  if (isLoading) {
    return (
        <div className="flex flex-col justify-center items-center">
        <Lottie animationData={loadingAnimation} style={{ width: 150, height: 150 }} />
      </div>
    );
  }

  if (deposits.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center">
        <Lottie animationData={noRecordsAnimation} style={{ width: 200, height: 200 }} />
        <p>No deposits found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg ">
      <div className="space-y-4">
        {deposits.map((deposit, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow">
            <div>
              <h3 className="text-md font-semibold">{deposit.depositId}</h3>
              <p className="text-sm text-gray-600">KES: {deposit.amount}</p>
              <p className="text-xs text-gray-500">{
        new Date(deposit.transactionDate).toLocaleDateString('en-GB', {
            day: 'numeric', 
            month: 'short', 
            year: 'numeric'
        })
    }</p>
            </div>
            <button
              onClick={() => handleViewDetails(deposit._id)}
              className="flex items-center justify-center p-2 bg-green-300 text-white rounded-full hover:bg-green-600 transition duration-150 ease-in-out"
            >
              <AiOutlineInfoCircle className="text-xl" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositHistory;
