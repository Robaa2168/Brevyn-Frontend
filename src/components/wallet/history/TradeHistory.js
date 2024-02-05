// Trade History.js

import React, { useEffect, useState } from 'react';
import api from '../../../api';
import Lottie from "lottie-react";
import unavailableAnimation from '../../lottie/noLinks.json';
import loadingAnimation from '../../lottie/loading.json';
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';



const History = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [trades, setTrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (!user || !user.token) {
          navigate('/login');
        }
      }, [user, navigate]);

    useEffect(() => {
        const fetchTrades = async () => {
            setIsLoading(true);
            try {
                // Assuming you have a bearer token for authorization
                const response = await api.get('/api/trade/user-trades', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                });
                setTrades(response.data);
            } catch (error) {
                console.error("Error fetching trades: ", error);
            }
            setIsLoading(false);
        };

        fetchTrades();
    }, []);

    return (
        <div className="flex flex-col flex-grow container mx-auto p-4 bg-white rounded-lg text-center ">
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
                            onClick={() => window.location.href = `/chat/${trade.tradeId}`}
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
export default History;
