import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { toast } from 'react-toastify';

const UserConversions = ({ userId }) => {
    const { user } = useUser();
    const [conversions, setConversions] = useState([]);

    useEffect(() => {
        const fetchConversions = async () => {
            try {
                const response = await api.get(`/api/customer/conversions/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setConversions(response.data);
                } else {
                    toast.error('Failed to load conversion data');
                }
            } catch (error) {
                console.error("Error fetching conversion data: ", error);
                toast.error(`Failed to load conversion data: ${error.message}`);
            }
        };

        fetchConversions();
    }, [userId, user.token]);

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-5">
            <h3 className="font-semibold text-lg mb-4">Conversions</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr className='text-xs'>
                            <th className="px-4 py-2">Transaction ID</th>
                            <th className="px-4 py-2">From Currency</th>
                            <th className="px-4 py-2">To Currency</th>
                            <th className="px-4 py-2">From Amount</th>
                            <th className="px-4 py-2">To Amount</th>
                            <th className="px-4 py-2">Rate</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conversions.map((conversion) => (
                            <tr key={conversion.transactionId} className="border-b">
                                <td className="px-4 py-2">{conversion.transactionId}</td>
                                <td className="px-4 py-2">{conversion.fromCurrency}</td>
                                <td className="px-4 py-2">{conversion.toCurrency}</td>
                                <td className="px-4 py-2">{conversion.fromAmount}</td>
                                <td className="px-4 py-2">{conversion.toAmount}</td>
                                <td className="px-4 py-2">{conversion.conversionRate}</td>
                                <td className="px-4 py-2">
                                    {new Date(conversion.createdAt).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserConversions;
