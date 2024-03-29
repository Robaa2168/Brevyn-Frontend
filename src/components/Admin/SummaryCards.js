import React, { useEffect, useState } from 'react';
import { FaUsers, FaBan, FaDollarSign, FaUserCheck, FaPiggyBank } from 'react-icons/fa'; // Add FaPiggyBank for the deposits icon
import api from '../../api'; // Adjust the import path as needed
import { useUser } from "../context";
import { useNavigate } from 'react-router-dom';

const SummaryCards = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [stats, setStats] = useState({
        totalUsers: 0,
        unverifiedUsers: 0,
        bannedUsers: 0,
        totalPendingWithdrawals: 0,
        totalSuccessfulDeposits: 0, // Add totalDeposits to your stats state if needed
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('api/admin/user-stats', {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // Ensure you're passing the correct auth token
                    },
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats: ", error);
            }
        };

        if (user && user.token) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="bg-white p-4 space-y-4 md:grid md:grid-cols-5 md:gap-4 md:space-y-0">
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-xs">Total Users</h5>
                    <p className="text-xs mt-2">{stats.totalUsers}</p>
                </div>
                <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
                    <FaUsers className="text-emerald-500 text-xl" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-xs">Unverified</h5>
                    <p className="text-xs mt-2">{stats.unverifiedUsers}</p>
                </div>
                <div className="rounded-full bg-yellow-500 bg-opacity-20 p-2">
                    <FaUserCheck className="text-yellow-500 text-xl" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-xs">Banned</h5>
                    <p className="text-xs mt-2">{stats.bannedUsers}</p>
                </div>
                <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
                    <FaBan className="text-emerald-500 text-xl" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-xs">Withdrawals</h5>
                    <p className="text-xs mt-2">{stats.totalPendingWithdrawals}</p>
                </div>
                <div>
                    <button
                        className="border border-gray-300 rounded text-xs hover:bg-gray-100 py-2 px-4"
                        onClick={() => navigate('/pending-withdrawals')}
                    >
                        View
                    </button>
                </div>
                <div className="rounded-full bg-emerald-500 bg-opacity-20 p-2">
                    <FaDollarSign className="text-emerald-500 text-xl" />
                </div>
            </div>

            {/* Deposits card */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                    <h5 className="text-xs">Deposits</h5>
                    <p className="text-xs mt-2">{stats.totalSuccessfulDeposits}</p>
                </div>
                <div className="rounded-full bg-blue-500 bg-opacity-20 p-2">
                    <FaPiggyBank className="text-blue-500 text-xl" />
                </div>
            </div>

        </div>
    );
};

export default SummaryCards;
