import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../context';
import { toast } from 'react-toastify';

const KYCEdit = () => {
    const { userId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [kycData, setKycData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dob: '',
        idNumber: '',
        town: '',
        country: ''
    });

    useEffect(() => {
        const fetchKycData = async () => {
            try {
                const response = await api.get(`/api/customer/kyc/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (response.status === 200) {
                    setKycData(response.data);
                } else {
                    toast.error('Failed to load KYC data');
                }
            } catch (error) {
                toast.error(`Error fetching KYC data: ${error.message}`);
            }
        };

        fetchKycData();
    }, [userId, user.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKycData({
            ...kycData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/api/customer/kyc/${userId}`, kycData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                toast.success('KYC updated successfully');
                navigate(`/user-details/${userId}`); // Adjust the navigation as needed
            } else {
                toast.error('Failed to update KYC');
            }
        } catch (error) {
            toast.error(`Error updating KYC: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Edit KYC</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={kycData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={kycData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={kycData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={kycData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        id="dob"
                        type="date"
                        name="dob"
                        value={kycData.dob ? kycData.dob.split('T')[0] : ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                        </div>
                        <div>
                        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">ID Number</label>
                        <input
                                             id="idNumber"
                                             type="text"
                                             name="idNumber"
                                             value={kycData.idNumber}
                                             onChange={handleChange}
                                             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                         />
                        </div>
                        <div>
                        <label htmlFor="town" className="block text-sm font-medium text-gray-700">Town</label>
                        <input
                                             id="town"
                                             type="text"
                                             name="town"
                                             value={kycData.town}
                                             onChange={handleChange}
                                             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                         />
                        </div>
                        <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                                             id="country"
                                             type="text"
                                             name="country"
                                             value={kycData.country}
                                             onChange={handleChange}
                                             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                         />
                        </div>
                        <div className="col-span-full flex justify-end mt-4">
                        <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                        Update KYC
                        </button>
                        </div>
                        </form>
                        </div>
                        );
                        };
                        
                        export default KYCEdit;
