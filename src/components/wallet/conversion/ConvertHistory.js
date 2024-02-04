import React, { useEffect, useState } from 'react';
import api from '../../../api'; // Update this path according to your project structure
import Lottie from "lottie-react";
import loadingAnimation from '../../lottie/loading.json';
import noDataAnimation from '../../lottie/noLinks.json'; 
import { useUser } from "../../context";
import { useNavigate } from 'react-router-dom';

const ConvertHistory = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [conversions, setConversions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchConversions = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/conversions', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setConversions(response.data);
            } catch (error) {
                console.error("Error fetching conversions: ", error);
            }
            setIsLoading(false);
        };

        fetchConversions();
    }, [user.token]);

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg text-center ">
            {isLoading ? (
                <div className="flex justify-center items-center py-4">
                    <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                </div>
            ) : conversions.length > 0 ? (
                conversions.map((conversion, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-center justify-between p-2 mt-3 border rounded">
                    <div className="text-left p-2">
    <p className="font-semibold text-sm">{conversion.transactionId}</p>
    <p className="text-xs text-gray-500">{conversion.fromAmount} {conversion.fromCurrency} To: {conversion.toAmount} {conversion.toCurrency}</p>
    <p className="text-xs text-gray-500">{
        new Date(conversion.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric', 
            month: 'short', 
            year: 'numeric'
        })
    }</p>
</div>

                        <button
                            onClick={() => navigate(`/conversion-details/${conversion.transactionId}`)}
                            className="px-4 py-1 mt-2 md:mt-0 text-xs border border-emerald-500 text-emerald-500 rounded hover:bg-emerald-100 hover:text-emerald-600">
                            View Details
                        </button>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <Lottie animationData={noDataAnimation} style={{ width: 200, height: 200 }} />
                    <p className="text-gray-500 font-semibold mt-4">
                        No Conversion Records Found
                    </p>
                </div>
            )}
        </div>
    );
};

export default ConvertHistory;
