import React, { useEffect, useState } from 'react';
import api from '../../api';
import Lottie from "lottie-react";
import loadingAnimation from '../lottie/loading.json';
import noCurrenciesAnimation from '../lottie/noLinks.json';
import { useUser } from "../context";
import { useNavigate } from 'react-router-dom';



const Currencies = ({ onViewDetails }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }
        const fetchAccounts = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/currencies/', { // Corrected endpoint
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.data && Array.isArray(response.data)) {
                    setAccounts(response.data);
                } else {
                    console.error("Unexpected API response structure:", response.data);
                    setAccounts([]); // Ensure accounts is always an array
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
                setAccounts([]); // Ensure accounts is always an array on error
            } finally {
                setIsLoading(false);
            }
        };


        fetchAccounts();
    }, [user, navigate]);

    const handleViewDetails = (currencyId) => {
        onViewDetails(currencyId);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Available Currencies</h2>
            <div className="flex flex-col items-center justify-center py-4">
                <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
            </div>
            </div>
        );
    }

    function getFlagImageUrl(currencyCode) {
        const flagImages = {
            USD: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1920px-Flag_of_the_United_States.svg.png',
            EUR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/1280px-Flag_of_Europe.svg.png',
            GBP: 'https://cdn.britannica.com/25/4825-050-977D8C5E/Flag-United-Kingdom.jpg',
            AUD: 'https://cdn.britannica.com/78/6078-004-77AF7322/Flag-Australia.jpg',
            NGN: 'https://cdn.britannica.com/68/5068-004-72A3F250/Flag-Nigeria.jpg',
            RWF: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Rwanda.svg',
            ZAR: 'https://cdn.britannica.com/27/4227-004-32423B42/Flag-South-Africa.jpg',
            UGX: 'https://cdn.britannica.com/22/22-004-0165975D/Flag-Uganda.jpg',
            KES: 'https://cdn.britannica.com/15/15-004-B5D6BF80/Flag-Kenya.jpg',
            ZMW: 'https://cdn.britannica.com/31/4231-004-F1DBFAE7/Flag-Zambia.jpg'
        };

        return flagImages[currencyCode] || '';
    }
    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Available Currencies</h2>
            {accounts?.length > 0 ? (
                <div className="flex flex-col">
                    {accounts.map((account) => (
                        <div key={account.currency} className="flex flex-wrap justify-between items-center p-4 border-b">
                            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3 mb-2 md:mb-0">
                                <img
                                    src={getFlagImageUrl(account.currency)}
                                    alt={`${account.currency} flag`}
                                    className="w-5 h-5 rounded-full object-cover mb-2 md:mb-0"
                                />
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold">{account.currency}</h3>
                                        {/* Status Pill */}
                                        <span className={`inline-block px-2 text-xs font-semibold rounded-full border ${account.isActive ? 'border-green-200 bg-green-100 text-emerald-800' : 'border-gray-300 bg-gray-200 text-gray-800'}`}>
                                            {account.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className='text-xs'>Balance: {account.balance}</p>
                                    </div>
                                </div>


                            </div>
                            <button
                                onClick={() => handleViewDetails(account._id)}
                                className="w-full sm:w-auto px-4 py-2 text-xs border border-emerald-500 text-emerald-500 rounded hover:bg-emerald-500 hover:text-white transition duration-150 ease-in-out">
                                View Details
                            </button>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-4">
                    <Lottie animationData={noCurrenciesAnimation} style={{ width: 200, height: 200 }} />
                    <p>No currencies found.</p>
                </div>
            )}
        </div>
    );
};

export default Currencies;