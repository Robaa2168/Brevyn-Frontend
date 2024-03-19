import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { toast } from 'react-toastify';

const UserDeposits = ({ userId }) => {
    const { user } = useUser();
    const [deposits, setDeposits] = useState([]);

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const response = await api.get(`/api/customer/${userId}/deposits`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setDeposits(response.data);
                } else {
                    toast.error('Failed to load deposit data');
                }
            } catch (error) {
                console.error("Error fetching deposit data: ", error);
                toast.error(`Failed to load deposit data: ${error.message}`);
            }
        };

        fetchDeposits();
    }, [userId, user.token]);

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-5">
            <h3 className="font-semibold text-lg mb-4">Deposits</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Deposit ID</th>
                            <th className="px-4 py-2">Phone Number</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Transaction Date</th>
                            <th className="px-4 py-2">Transaction ID</th>
                            <th className="px-4 py-2">Receipt</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposits.map((deposit) => (
                            <tr key={deposit.transactionId} className="border-b">
                                <td className="px-4 py-2">{deposit.depositId}</td>
                                <td className="px-4 py-2">{deposit.initiatorPhoneNumber}</td>
                                <td className="px-4 py-2">{deposit.amount}</td>
                                <td className="px-4 py-2">
                                    {new Date(deposit.transactionDate).toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </td>

                                <td className="px-4 py-2">{deposit.transactionId}</td>
                                <td className="px-4 py-2">{deposit.mpesaReceiptNumber}</td>
                                <td className="px-4 py-2">{deposit.isSuccess ? 'Success' : 'Failed'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDeposits;
