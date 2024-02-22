// TransferHistory.js

import React, { useEffect, useState } from 'react';
import api from '../../../api';
import Lottie from "lottie-react";
import unavailableAnimation from '../../lottie/noLinks.json';
import loadingAnimation from '../../lottie/loading.json';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';


const TransferHistory = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const DEFAULT_IMAGE_URL = 'https://example.com/default-image.jpg';

    // Helper function for date formatting
const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert to Date object
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }); // Output in "23 Dec 2022" format
};

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                // Replace with your actual endpoint to fetch transfer history
                const response = await api.get('/api/transfers/transfers/', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions: ", error);
            }
            setIsLoading(false);
        };

        fetchTransactions();
    }, [user.token]);

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow flex flex-col">
    
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                </div>
            ) : transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 mt-3 border rounded">
                        <div className="flex items-center space-x-3">
                            {transaction.sender?._id=== user._id ? (
                                transaction.receiver?.profileImage && transaction.receiver?.profileImage !== DEFAULT_IMAGE_URL ? (
                                    <img src={transaction.receiver?.profileImage} alt="Receiver's Profile" className="h-10 w-10 rounded-full" />
                                ) : (
                                    <div className="flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-200 text-white shadow-lg">
                                        <span className="text-xl font-bold">
                                            {transaction.receiverFirstName[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                )
                            ) : (
                                transaction.sender?.profileImage && transaction.sender.profileImage !== DEFAULT_IMAGE_URL ?(
                                    <img src={transaction.sender?.profileImage} alt="Sender's Profile" className="h-10 w-10 rounded-full" />
                                ) : (
                                    <div className="flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-200 text-white shadow-lg">
                                        <span className="text-xl font-bold">
                                            {transaction.senderFirstName[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                )
                            )}
                            <div>
                                <p className="font-semibold text-xs">
                                    {transaction.sender?._id === user._id ? transaction.receiverFirstName : transaction.senderFirstName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(transaction.createdAt)} · {transaction.status}
                                </p>
                            </div>
                        </div>
                        <span className={`font-bold text-xs text-center ${transaction.sender?._id === user?._id ? 'text-red-500' : 'text-green-500'}`}>
                        {transaction.sender?._id === user._id ? '-' : '+'}{transaction.currency} {transaction.amount}
                        </span>
                    </div>
                ))
            ) : (
                <div className="flex justify-center items-center flex-col">
                    <Lottie animationData={unavailableAnimation} style={{ width: 200, height: 200 }} />
                    <p className='text-gray-500 font-semibold mt-4'>No transactions found</p>
                </div>
            )}
        </div>
    );
    
};


export default TransferHistory;
