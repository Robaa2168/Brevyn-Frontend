import React, { useEffect, useState } from 'react';
import api from '../../../api'; // Adjust the path as needed
import Lottie from "lottie-react";
import loadingAnimation from '../../lottie/loading.json'; // Adjust the path as needed
import noRecordAnimation from '../../lottie/noLinks.json'; // Ensure you have a suitable animation for "no records found"
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useUser } from "../../context"; // Adjust the import path to your context

const TransferDetail = ({ transferId, onBack }) => {
    const { user } = useUser();
    const [transferDetails, setTransferDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransferDetails = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/transfers/transfer/${transferId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (response.status === 200) {
                    setTransferDetails(response.data);
                } else {
                    setError('Failed to fetch transfer details');
                }
            } catch (error) {
                console.error("Error fetching transfer details:", error);
                setError('An error occurred while fetching transfer details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransferDetails();
    }, [transferId, user.token]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
            </div>
        );
    }
    
    if (!transferDetails || error) {
        return (
            <div className="flex flex-col justify-center items-center">
                <Lottie animationData={noRecordAnimation} style={{ width: 200, height: 200 }} />
                <p className="mt-4 text-sm font-semibold text-gray-600">{error || "No transfer details found."}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg ">
            <button onClick={onBack} className="mb-4 flex items-center text-sm text-gray-600">
                <AiOutlineArrowLeft className="mr-2" /> Back
            </button>
            <div className="border p-4 text-xs rounded-lg">
                <p className="mb-2"><strong>Amount:</strong> {transferDetails.amount} {transferDetails.currency}</p>
                <p className="mb-2"><strong>Transaction Date:</strong> {new Date(transferDetails.createdAt).toLocaleString()}</p>
                <p className="mb-2"><strong>Sender:</strong> {transferDetails.senderFirstName}</p>
                <p className="mb-2"><strong>Receiver:</strong> {transferDetails.receiverFirstName}</p>
                <p className="mb-2"><strong>Transaction ID:</strong> {transferDetails.transactionId}</p>
                {transferDetails.status && <p className="mb-2"><strong>Status:</strong> {transferDetails.status}</p>}
                {/* Include additional details as needed */}
            </div>
        </div>
    );
};

export default TransferDetail;
