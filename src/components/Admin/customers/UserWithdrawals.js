import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { toast } from 'react-toastify';

const UserWithdrawals = ({ userId }) => {
    const { user } = useUser();
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const response = await api.get(`/api/customer/${userId}/withdrawals`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setWithdrawals(response.data);
                } else {
                    toast.error('Failed to load withdrawal data');
                }
            } catch (error) {
                console.error("Error fetching withdrawal data: ", error);
                toast.error(`Failed to load withdrawal data: ${error.message}`);
            }
        };

        fetchWithdrawals();
    }, [userId, user.token]);

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-5">
            <h3 className="font-semibold text-lg mb-4">Withdrawals</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Withdrawal ID</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Currency</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.map((withdrawal) => (
                            <tr key={withdrawal.withdrawalId} className="border-b">
                                <td className="px-4 py-2">{withdrawal.withdrawalId}</td>
                                <td className="px-4 py-2">{withdrawal.amount}</td>
                                <td className="px-4 py-2">{withdrawal.currency}</td>
                                <td className="px-4 py-2">{withdrawal.status}</td>
                                <td className="px-4 py-2">
                                    {new Date(withdrawal.createdAt).toLocaleString(undefined, {
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

export default UserWithdrawals;
