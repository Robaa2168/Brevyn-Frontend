import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PendingWithdrawals = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);

    useEffect(() => {
        const fetchPendingWithdrawals = async () => {
            try {
                const response = await api.get(`/api/customer/pending-withdrawals`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setPendingWithdrawals(response.data);
                } else {
                    toast.error('Failed to load pending withdrawal data');
                }
            } catch (error) {
                console.error("Error fetching pending withdrawal data: ", error);
                toast.error(`Failed to load pending withdrawal data: ${error.message}`);
            }
        };

        fetchPendingWithdrawals();
    }, [user.token]);

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-5">
            <h3 className="font-semibold text-lg mb-4">Pending Withdrawals</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Withdrawal ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Currency</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">View More</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingWithdrawals.map((withdrawal) => (
                            <tr key={withdrawal._id} className="border-b">
                                <td className="px-4 py-2">{withdrawal.withdrawalId}</td>
                                <td className="px-4 py-2">{withdrawal.firstName}</td>
                                <td className="px-4 py-2">{withdrawal.amount}</td>
                                <td className="px-4 py-2">{withdrawal.currency}</td>
                                <td className="px-4 py-2">{withdrawal.status}</td>
                                <td className="px-4 py-2">
                                    {formatDistanceToNow(new Date(withdrawal.createdAt), { addSuffix: false })}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => navigate(`/user-details/${withdrawal.userId}`)}
                                        className="px-4 py-2 border border-gray-300 rounded text-xs hover:bg-gray-100"
                                    >
                                        View More
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingWithdrawals;
