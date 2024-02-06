import React, { useEffect, useState } from 'react';
import api from '../../../api'; // Adjust this import path to your file structure
import Lottie from 'lottie-react';
import loadingAnimation from '../../lottie/loading.json'; // Adjust this path as needed
import noRecordsAnimation from '../../lottie/noLinks.json'; // Update this path to match your file structure for a "no records found" animation
import { useUser } from '../../context'; // Update this import to match your context location
import { AiOutlineInfoCircle } from 'react-icons/ai'; // Importing an icon for the view details button

const TransferHistory = ({ onViewDetails }) => {
  const { user } = useUser();
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) {
      return;
    }

    const fetchTransfers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/transfers/transfers/', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.status === 200 && Array.isArray(response.data)) {
          setTransfers(response.data);
        } else {
          setTransfers([]);
        }
      } catch (error) {
        console.error("Error fetching transfer history:", error);
        setTransfers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransfers();
}, [user?.token]);
  

  const handleViewDetails = (transferId) => {
    onViewDetails(transferId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Lottie animationData={loadingAnimation} style={{ width: 150, height: 150 }} />
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Lottie animationData={noRecordsAnimation} style={{ width: 200, height: 200 }} />
        <p>No transfers found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg ">
      <div className="space-y-4">
        {transfers.map((transfer, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow">
            <div>
              <h3 className="text-md font-semibold">{transfer.sender === user?._id
                            ? transfer.receiverFirstName
                            : transfer.senderFirstName}</h3>
              <p className={`text-xs ${transfer.sender === user?._id ? 'text-red-500' : 'text-green-500'} font-bold`}>
                        {transfer.sender === user?._id ? '-' : '+'}{transfer.currency} {transfer.amount}
                      </p>
              <p className="text-xs text-gray-500">{
                new Date(transfer.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric'
                })
              }</p>
            </div>
            <button
              onClick={() => handleViewDetails(transfer._id)}
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

export default TransferHistory;
