import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useUser } from "../../context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const UserInfo = ({ userId }) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [userInfo, setUserInfo] = useState(null);
    const [userKyc, setUserKyc] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userResponse = await api.get(`/api/customer/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (userResponse.status === 200 && userResponse.data) {
                    setUserInfo(userResponse.data);
                    toast.success('User data loaded successfully');
                } else {
                    toast.error('Failed to load user data');
                }

                const kycResponse = await api.get(`/api/customer/kyc/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                if (kycResponse.status === 200 && kycResponse.data) {
                    setUserKyc(kycResponse.data);
                    toast.success('KYC data loaded successfully');
                } else {
                    toast.error('Failed to load KYC data');
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                toast.error(`Failed to load data: ${error.response ? error.response.data.message : error.message}`);
            }
        };

        fetchUserInfo();
    }, [userId, user.token]);

    return (
        <div className="p-4">
            <ToastContainer />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
    <h3 className="font-semibold text-md mb-2">Account Details</h3>
    <FontAwesomeIcon
        icon={faEdit}
        onClick={() => navigate(`/user-edit/${userId}`)}
        className="cursor-pointer text-blue-500 hover:text-blue-700"
    />
</div>

                    {userInfo ? (
                        <div className="text-xs space-y-2">
                            <div className="flex justify-between">
                                <p>Username:</p>
                                <p>{userInfo.username}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Email:</p>
                                <p>{userInfo.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Phone Number:</p>
                                <p>{userInfo.phoneNumber}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Role:</p>
                                <p>{userInfo.role}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Pay ID:</p>
                                <p>{userInfo.payId}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Account Status:</p>
                                <p>{userInfo.isBanned ? 'Banned' : 'Active'}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Verified:</p>
                                <p>{userInfo.isVerified ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Phone Verified:</p>
                                <p>{userInfo.isPhoneVerified ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Premium Account:</p>
                                <p>{userInfo.isPremium ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Points:</p>
                                <p>{userInfo.points}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Balance:</p>
                                <p>{userInfo.balance}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Last Login:</p>
                                <p>{userInfo.lastLogin ? new Date(userInfo.lastLogin).toLocaleString() : 'Never'}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Referral Code:</p>
                                <p>{userInfo.referralCode}</p>
                            </div>
                            {userInfo.trackingInfo && userInfo.trackingInfo.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold">Tracking Info</h4>
                                    {userInfo.trackingInfo.map((info, index) => (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between">
                                                <p>Fingerprint ID:</p>
                                                <p>{info.fingerprintId}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>User IP:</p>
                                                <p>{info.userIp}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>Browser:</p>
                                                <p>{info.browser}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>OS:</p>
                                                <p>{info.os}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>Platform:</p>
                                                <p>{info.platform}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p>Device:</p>
                                                <p>{info.device}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading user account information...</p>
                    )}
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <div className="flex justify-between items-center mb-1">
    <h3 className="font-semibold text-md mb-2">KYC Details</h3>
    <FontAwesomeIcon
        icon={faEdit}
        onClick={() => navigate(`/kyc-edit/${userId}`)}
        className="cursor-pointer text-blue-500 hover:text-blue-700"
    />
</div>
                    {userKyc ? (
                        <div className="text-xs space-y-2">
                            <div className="flex justify-between">
                                <p>First Name:</p>
                                <p>{userKyc.firstName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Last Name:</p>
                                <p>{userKyc.lastName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Phone:</p>
                                <p>{userKyc.phone}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Email:</p>
                                <p>{userKyc.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Date of Birth:</p>
                                <p>{new Date(userKyc.dob).toLocaleDateString()}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>ID Number:</p>
                                <p>{userKyc.idNumber}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Town:</p>
                                <p>{userKyc.town}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Country:</p>
                                <p>{userKyc.country}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading KYC information...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
