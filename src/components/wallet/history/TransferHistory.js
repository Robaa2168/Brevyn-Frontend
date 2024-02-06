// TransferHistory.js

import React, { useEffect, useState } from 'react';
import api from '../../../api';
import Lottie from "lottie-react";
import unavailableAnimation from '../../lottie/noLinks.json';
import loadingAnimation from '../../lottie/loading.json';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';


const TransferHistory = ({ setActiveComponent }) => {
    const { user } = useUser(); // Assuming you have a context that provides user info
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }

        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                // Assuming your API requires authorization and provides a route to fetch transactions
                const response = await api.get('/api/transactions/transfer-history', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [user, navigate]);

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg text-center">
            {isLoading ? (
                <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
            ) : transactions.length > 0 ? (
                <ul className="space-y-2">
                    {transactions.map((transaction) => (
                        <li key={transaction._id} className="flex justify-between items-center border-b py-3">
                            <div className="flex items-center text-sm">
                                <div className="flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white shadow-lg mr-2">
                                    <span className="text-xl font-bold">
                                        {transaction.sender === user?.id ? transaction.receiverFirstName[0]?.toUpperCase() : transaction.senderFirstName[0]?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-semibold truncate">
                                        {transaction.sender === user?.id ? transaction.receiverFirstName : transaction.senderFirstName}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {new Date(transaction.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm ${transaction.sender === user?.id ? 'text-red-500' : 'text-green-500'} font-bold`}>
                                    {transaction.sender === user?.id ? '-' : '+'}${transaction.amount}
                                </p>
                                <p className="text-xs text-gray-600">{transaction.status}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <Lottie animationData={unavailableAnimation} style={{ width: 200, height: 200 }} />
                    <p className="text-gray-500 font-semibold mt-4">
                        No Transfer Records Found
                    </p>
                </div>
            )}
        </div>
    );
};

export default TransferHistory;
