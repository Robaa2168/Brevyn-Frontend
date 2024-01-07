// SellerHistory.js
import React, { useEffect, useState } from 'react';
import api from '../../api'; // Ensure this points to your API configuration
import Lottie from "lottie-react";
import unavailableAnimation from '../lottie/noLinks.json';
import loadingAnimation from '../lottie/loading.json';
import { useUser } from "../context"; // Make sure the context provides seller details
import { useNavigate } from 'react-router-dom';

const SellerHistory = () => {
    const navigate = useNavigate();
    const { user } = useUser(); // This should now be the seller's user context
    const [trades, setTrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchTrades = async () => {
            setIsLoading(true);
            try {
                // Modify this to hit the endpoint that fetches trades for the seller
                const response = await api.get('/api/trade/seller-trades', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setTrades(response.data); // Set the fetched trades
            } catch (error) {
                console.error("Error fetching trades: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrades();
    }, [user.token]);

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md text-center sm:w-2/3"> {/* Add sm:w-2/3 */}
            <h2 className="text-lg font-bold mb-4">Trade History</h2>
            {isLoading ? (
                <div className="flex justify-center items-center py-4">
                    <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                </div>
            ) : trades.length > 0 ? (
                trades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-2 mt-3 border rounded">
                        <div className="text-left">
                            <p className="font-semibold text-xs"> {trade.tradeId}</p>
                            <p className="text-xs text-gray-500">${trade.amount} - Points: {trade.points}</p>
                            <p className={`font-semibold text-xs ${trade.status === 'cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                                {trade.status}
                            </p>

                        </div>
                        <button
                            onClick={() => window.location.href = `/portal/${trade.tradeId}`}
                            className="px-4 py-1 text-xs border border-emerald-500 text-emerald-500 rounded hover:bg-emerald-100 hover:text-emerald-600">
                            View
                        </button>

                    </div>
                ))
            ) : (
                // Show a message when there are no trades
                <div className="flex flex-col items-center justify-center">
                    <Lottie animationData={unavailableAnimation} style={{ width: 200, height: 200 }} />
                    <p className="text-gray-500 font-semibold mt-4">
                        No Records Found
                    </p>
                </div>
            )}
        </div>
    );
};
export default SellerHistory;
