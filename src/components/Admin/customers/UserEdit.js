import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserEdit = () => {
    const { userId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        payId:'',
        email: '',
        phoneNumber: '',
        role: '',
        isBanned: false,
        isVerified: false,
        isPhoneVerified: false,
        isPremium: false,
        points: 0,
        balance: 0,
        referralCode: '',
        uniqueId: '',
        lastLogin: '',
        // You can add more fields if needed
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/api/customer/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setUserData(response.data);
                } else {
                    toast.error('Failed to load user data');
                }
            } catch (error) {
                toast.error(`Error fetching user data: ${error.message}`);
            }
        };

        fetchUserData();
    }, [userId, user.token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/api/customer/user/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                toast.success('User updated successfully');
                navigate('/hamerling');
            } else {
                toast.error('Failed to update user');
            }
        } catch (error) {
            toast.error(`Error updating user: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow pb-20">
            <ToastContainer />
          <h2 className="text-xl font-semibold mb-6">Edit User</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="username" className="block text-xs font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className="mt-1 text-xs block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="username" className="block text-xs font-medium text-gray-700">payId</label>
              <input
                id="payId"
                type="text"
                name="payId"
                value={userData.payId}
                onChange={handleChange}
                className="mt-1 text-xs block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="mt-1 text-xs block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
                className="mt-1 text-xs block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="role" className="block text-xs font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                className="mt-1 text-xs block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              >
                <option value="donor">Donor</option>
                <option value="beneficiary">Beneficiary</option>
                <option value="admin">Admin</option>
              </select>
            </div>
           
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="points" className="block text-xs font-medium text-gray-700">Points</label>
              <input
                id="points"
                type="number"
                name="points"
                value={userData.points}
                onChange={handleChange}
                className="mt-1 text-xs block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="balance" className="block text-xs font-medium text-gray-700">Balance</label>
              <input
                id="balance"
                type="number"
                name="balance"
                value={userData.balance}
                onChange={handleChange}
                className="mt-1 text-xs block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
                />
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                <label htmlFor="referralCode" className="block text-xs font-medium text-gray-700">Referral Code</label>
                <input
                         id="referralCode"
                         type="text"
                         name="referralCode"
                         value={userData.referralCode}
                         onChange={handleChange}
                         className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
                       />
                </div>
                <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="isBanned" className="block text-xs font-medium text-gray-700">Is Banned</label>
              <input
                id="isBanned"
                type="checkbox"
                name="isBanned"
                checked={userData.isBanned}
                onChange={handleChange}
                className="mt-1 text-xs block leading-tight bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="isVerified" className="block text-xs font-medium text-gray-700">Is Verified</label>
              <input
                id="isVerified"
                type="checkbox"
                name="isVerified"
                checked={userData.isVerified}
                onChange={handleChange}
                className="mt-1 text-xs block leading-tight bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="isPhoneVerified" className="block text-xs font-medium text-gray-700">Is Phone Verified</label>
              <input
                id="isPhoneVerified"
                type="checkbox"
                name="isPhoneVerified"
                checked={userData.isPhoneVerified}
                onChange={handleChange}
                className="mt-1 text-xs block leading-tight bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label htmlFor="isPremium" className="block text-xs font-medium text-gray-700">Is Premium</label>
              <input
                id="isPremium"
                type="checkbox"
                name="isPremium"
                checked={userData.isPremium}
                onChange={handleChange}
                className="mt-1 text-xs block leading-tight bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
                <div className="col-span-full lg:col-span-2 flex justify-end mt-4">
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Update User
                </button>
                </div>
                </form>
                </div>
                );
                };
                
                export default UserEdit;