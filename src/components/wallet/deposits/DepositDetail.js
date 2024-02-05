import React, { useEffect, useState } from 'react';
import api from '../../../api'; // Adjust the path as needed
import Lottie from "lottie-react";
import loadingAnimation from '../../lottie/loading.json'; // Adjust the path as needed
import noRecordAnimation from '../../lottie/noLinks.json'; // Adjust the path as needed
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useUser } from "../../context"; // Adjust the import path to your context

const DepositDetail = ({ depositId, onBack }) => {
    const { user } = useUser();
    const [depositDetails, setDepositDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDepositDetails = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/deposits/deposits/${depositId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (response.status === 200) {
                    setDepositDetails(response.data);
                } else {
                    setError('Failed to fetch deposit details');
                }
            } catch (error) {
                console.error("Error fetching deposit details:", error);
                setError('An error occurred while fetching deposit details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDepositDetails();
    }, [depositId, user.token]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
            </div>
        );
    }
    
    if (!depositDetails) {
        return (
            <div className="flex flex-col justify-center items-center">
                <Lottie animationData={noRecordAnimation} style={{ width: 200, height: 200 }} />
                <p className="mt-4 text-sm font-semibold text-gray-600">No deposit details found.</p>
            </div>
        );
    }
    

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      
            <div className="border p-4 text-xs rounded-lg">
                <p className="mb-2"><strong>Amount:</strong> {depositDetails.amount} KES</p>
                <p className="mb-2"><strong>Transaction Date:</strong> {new Date(depositDetails.transactionDate).toLocaleString()}</p>
                <p className="mb-2"><strong>Initiator Phone:</strong> {depositDetails.initiatorPhoneNumber}</p>
                {depositDetails.mpesaReceiptNumber && <p className="mb-2"><strong>M-Pesa Receipt:</strong> {depositDetails.mpesaReceiptNumber}</p>}
                {depositDetails.error && <p className="mb-2 text-red-500"><strong>Error:</strong> {depositDetails.error}</p>}
                {/* Include additional details as needed */}
            </div>
            {/* Additional actions or information can be added here */}
        </div>
    );
};

export default DepositDetail;
