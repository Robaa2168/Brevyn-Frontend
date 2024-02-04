// WithdrawalHistory.js

import React, { useEffect, useState } from 'react';
import api from '../../api';
import Lottie from "lottie-react";
import unavailableAnimation from '../lottie/noLinks.json';
import loadingAnimation from '../lottie/loading.json';
import { useUser } from "../context";
import { useNavigate } from 'react-router-dom';

const WithdrawalHistory = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [withdrawals, setWithdrawals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/transactions/withdraw/user-withdrawals', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                });
                setWithdrawals(response.data);
            } catch (error) {
                console.error("Error fetching withdrawals: ", error);
            }
            setIsLoading(false);
        };

        fetchWithdrawals();
    }, []);

    return (
        <div className="flex flex-col flex-grow container mx-auto p-4 bg-white rounded-lg shadow-md text-center ">
            <h2 className="text-lg font-bold mb-4">Withdrawal History</h2>
            {isLoading ? (
                <div className="flex justify-center items-center py-4">
                    <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                </div>
            ) : withdrawals.length > 0 ? (
                withdrawals.map((withdrawal, index) => (
                    <div key={index} className="flex items-center justify-between p-2 mt-3 border rounded">
                        <div className="text-left">
                            <p className="font-semibold text-xs">{withdrawal.withdrawalId}</p>
                            <p className="text-xs text-gray-500">${withdrawal.amount}</p>
                            <p className={`font-semibold text-xs ${withdrawal.status === 'pending' ? 'text-yellow-500' :
                                    withdrawal.status === 'processing' ? 'text-blue-500' :
                                        withdrawal.status === 'completed' ? 'text-green-500' :
                                            withdrawal.status === 'failed' ? 'text-red-500' :
                                                withdrawal.status === 'cancelled' ? 'text-red-500' : 'text-black'
                                }`}>
                                {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                            </p>

                        </div>
                        <button
                            onClick={() => window.location.href = `/withdrawal-details/${withdrawal.withdrawalId}`}
                            className="px-4 py-1 text-xs border border-emerald-500 text-emerald-500 rounded hover:bg-emerald-100 hover:text-emerald-600">
                            View Details
                        </button>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <Lottie animationData={unavailableAnimation} style={{ width: 200, height: 200 }} />
                    <p className="text-gray-500 font-semibold mt-4">
                        No Withdrawal Records Found
                    </p>
                </div>
            )}
        </div>
    );
};

export default WithdrawalHistory;
