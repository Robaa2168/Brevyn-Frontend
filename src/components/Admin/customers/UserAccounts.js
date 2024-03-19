import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { toast } from 'react-toastify';

const UserAccounts = ({ userId }) => {
    const { user } = useUser();
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, [userId, user.token]);

    const fetchAccounts = async () => {
        try {
            const response = await api.get(`/api/customer/${userId}/accounts`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setAccounts(response.data);
            } else {
                toast.error('Failed to load account data');
            }
        } catch (error) {
            console.error("Error fetching account data: ", error);
            toast.error(`Failed to load account data: ${error.message}`);
        }
    };

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    const handleHoldRelease = async (account) => {
        try {
            const response = await api.patch(`/api/customer/account/${account._id}/toggle-held`, {
                isHeld: !account.isHeld
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                toast.success('Account hold status updated');
                fetchAccounts();
            } else {
                toast.error('Failed to update account hold status');
            }
        } catch (error) {
            console.error("Error updating account hold status: ", error);
            toast.error(`Failed to update account hold status: ${error.message}`);
        }
    };

    const handleActiveInactive = async (account) => {
        try {
            const response = await api.patch(`/api/customer/account/${account._id}/toggle-active`, {
                isActive: !account.isActive
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                toast.success('Account active status updated');
                fetchAccounts();
            } else {
                toast.error('Failed to update account active status');
            }
        } catch (error) {
            console.error("Error updating account active status: ", error);
            toast.error(`Failed to update account active status: ${error.message}`);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/api/customer/account/${selectedAccount._id}/update-balance`, {
                balance: selectedAccount.balance
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                toast.success('Account balance updated');
                setIsModalOpen(false);
                fetchAccounts();
            } else {
                toast.error('Failed to update account balance');
            }
        } catch (error) {
            console.error("Error updating account balance: ", error);
            toast.error(`Failed to update account balance: ${error.message}`);
        }
    };

    return (
        <div className="bg-white text-xs shadow rounded-lg p-4 mt-5">
            <h3 className="font-semibold text-lg mb-4">Accounts</h3>
            <div className="overflow-x-auto text-xs">
                <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr className='text-xs'>
                            <th className="px-4 py-2">Currency</th>
                            <th className="px-4 py-2">Balance</th>
                            <th className="px-4 py-2">Active</th>
                            <th className="px-4 py-2">Held</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account._id} className="border-b text-xs">
                                <td className="px-4 py-2">{account.currency}</td>
                                <td className="px-4 py-2">{account.balance}</td>
                                <td className="px-4 py-2">
                                    <button 
                                        onClick={() => handleActiveInactive(account)}
                                        className={`px-2 py-1 text-xs font-medium rounded ${account.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                                    >
                                        {account.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                    </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleHoldRelease(account)}
                                                className={`px-2 py-1 text-xs font-medium rounded ${account.isHeld ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}
                                            >
                                                {account.isHeld ? 'Release' : 'Hold'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 flex justify-around">
                                            <button
                                                onClick={() => handleEdit(account)}
                                                className="px-2 py-1 text-xs font-medium rounded bg-blue-200 text-blue-800"
                                            >
                                                Edit Balance
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white text-xs p-4 rounded-lg max-w-sm mx-auto">
                                <h2 className="text-lg font-semibold mb-4">Edit Account Balance</h2>
                                <form onSubmit={handleSubmitEdit} className="space-y-4">
                                    <div>
                                        <label htmlFor="balance" className="block text-xs font-medium text-gray-700">Balance</label>
                                        <input
                                            id="balance"
                                            type="number"
                                            name="balance"
                                            value={selectedAccount.balance}
                                            onChange={(e) => setSelectedAccount({ ...selectedAccount, balance: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        export default UserAccounts;

