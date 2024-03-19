import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AssociatedAccounts = ({ userId }) => {
    const { user } = useUser();
    const [associatedAccounts, setAssociatedAccounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssociatedAccounts = async () => {
            try {
                const response = await api.get(`/api/customer/${userId}/associated-accounts`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setAssociatedAccounts(response.data);
                } else {
                    toast.error('Failed to load associated accounts');
                }
            } catch (error) {
                console.error("Error fetching associated accounts: ", error);
                toast.error(`Failed to load associated accounts: ${error.message}`);
            }
        };

        fetchAssociatedAccounts();
    }, [userId, user.token]);

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-5">
            <h3 className="font-semibold text-lg mb-4">Associated Accounts</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Username</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone Number</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {associatedAccounts.map((account) => (
                            <tr key={account._id} className="border-b">
                                <td className="px-4 py-2">{account.username}</td>
                                <td className="px-4 py-2">{account.email}</td>
                                <td className="px-4 py-2">{account.phoneNumber}</td>
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() => navigate(`/user-details/${account._id}`)}
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

export default AssociatedAccounts;
