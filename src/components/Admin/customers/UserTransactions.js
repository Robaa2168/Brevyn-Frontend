import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { toast } from 'react-toastify';

const UserTransactions = ({ userId }) => {
    const { user } = useUser();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get(`/api/customer/${userId}/transactions`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setTransactions(response.data);
                } else {
                    toast.error('Failed to load transaction data');
                }
            } catch (error) {
                console.error("Error fetching transaction data: ", error);
                toast.error(`Failed to load transaction data: ${error.message}`);
            }
        };

        fetchTransactions();
    }, [userId, user.token]);

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-5">
            <h3 className="font-semibold text-lg mb-4">Transactions</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Transaction ID</th>
                            <th className="px-4 py-2">From</th>
                            <th className="px-4 py-2">To</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Currency</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.transactionId} className="border-b">
                                <td className="px-4 py-2">{transaction.transactionId}</td>
                                <td className="px-4 py-2">{transaction.senderFirstName}</td>
                                <td className="px-4 py-2">{transaction.receiverFirstName}</td>
                                <td className="px-4 py-2">{transaction.transactionType}</td>
                                <td className="px-4 py-2">{transaction.amount}</td>
                                <td className="px-4 py-2">{transaction.currency}</td>
                                <td className="px-4 py-2">{transaction.status}</td>
                                <td className="px-4 py-2">{new Date(transaction.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTransactions;
