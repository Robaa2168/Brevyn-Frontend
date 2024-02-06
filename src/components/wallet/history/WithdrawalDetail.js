import React, { useEffect, useState } from 'react';
import api from '../../../api';
import Lottie from "lottie-react";
import { FaLock } from 'react-icons/fa';
import loadingAnimation from '../../lottie/loading.json';
import errorAnimation from '../../lottie/noLinks.json';
import { useUser } from "../../context";
import { AiOutlineArrowLeft } from 'react-icons/ai';


const WithdrawalDetail = ({ withdrawalId, onBack }) => {
    const { user } = useUser();
    const [withdrawalDetails, setWithdrawalDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWithdrawalDetails = async () => {
            setIsLoading(true);
            try {
                // Assuming an endpoint exists to get withdrawal details by ID
                const response = await api.get(`/api/transactions/withdrawals/${withdrawalId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (response.status === 200 && response.data) {
                    setWithdrawalDetails(response.data);
                } else {
                    setError('Failed to fetch withdrawal details');
                }
            } catch (error) {
                console.error("Error fetching withdrawal details:", error);
                setError('An error occurred while fetching withdrawal details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWithdrawalDetails();
    }, [withdrawalId, user.token]);

    const statusClasses = (status) => {
        switch (status) {
            case 'pending':
            case 'processing':
                return 'bg-yellow-200 text-yellow-800';
            case 'completed':
                return 'bg-green-200 text-green-800';
            case 'failed':
                return 'bg-red-200 text-red-800';
            case 'cancelled':
                return 'bg-gray-200 text-gray-800';
            default:
                return 'bg-gray-200 text-gray-800'; // Default case for an unknown status
        }
    };
    if (isLoading) {
        return (
            <div className="container mx-auto p-4 bg-white rounded-lg border shadow-xl ">
                <div className="flex justify-center items-center">
                    <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                </div>
            </div>
        );
    }
    

    if (error || !withdrawalDetails) {
        return (
            <div className="container mx-auto p-4 bg-white rounded-lg border shadow-xl ">
            <div className="flex flex-col justify-center items-center">
                <Lottie animationData={errorAnimation} style={{ width: 200, height: 200 }} />
                <p className="mt-4 text-sm font-semibold text-gray-600">{error || "No withdrawal details found."}</p>
            </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 bg-white rounded-lg border shadow-xl ">
<div className="border-b border-dotted pb-4">
    <div className="flex flex-col lg:flex-row items-center justify-between">
        <button onClick={onBack} className="flex items-center justify-center p-2 text-emerald-600 hover:text-emerald-800 transition-colors duration-150 ease-in-out mb-4 lg:mb-0 lg:mr-4">
            <span className="inline-flex items-center justify-center p-2 mr-2 rounded-full border border-green-600 bg-green-100 hover:bg-green-200">
                <AiOutlineArrowLeft />
            </span>
            Back
        </button>
        <p className="text-xs text-center text-gray-600 flex-1">Please review the details of your withdrawal below.</p>
    </div>
</div>


 {/* Informational message for processing or pending transactions */}
 {(withdrawalDetails.status === 'processing' || withdrawalDetails.status === 'pending') && (
        <div className="bg-blue-50 border border-blue-300 text-blue-700 p-4 mt-4 rounded text-xs" role="alert">
            <p className="font-bold">Processing Withdrawal</p>
            <p>
                Your withdrawal of <strong>{withdrawalDetails.withdrawalId}</strong> is currently processing. International transactions typically process within 72 hours. 
                For more information regarding the transaction, contact <a href="mailto:support@verdantcharity.org" className="underline">support@verdantcharity.org</a>.
            </p>
        </div>
    )}


            <div className="pt-4">
                {/* Conditional rendering based on the type of withdrawal */}
                {withdrawalDetails.type === 'Bank' && (
                    <div className="text-xs mb-4">
                        <div className="flex justify-between mb-2">
                            <p><strong>Bank:</strong></p>
                            <p>{withdrawalDetails.bank}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p><strong>Account No:</strong></p>
                            <p>{withdrawalDetails.accountNo}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p><strong>Beneficiary Name:</strong></p>
                            <p>{withdrawalDetails.beneficiaryName}</p>
                        </div>
                        {/* Repeat the pattern for other bank-specific details */}
                    </div>

                )}

                {withdrawalDetails.type === 'Paypal' && (
                    <div className="text-xs mb-4">
                        <div className="flex justify-between mb-2">
                            <p><strong>Email:</strong></p>
                            <p> {withdrawalDetails.email}</p>
                        </div>
                    </div>
                )}

                {withdrawalDetails.type === 'MobileMoney' && (
                    <div className="text-xs mb-4">
                        <div className="flex justify-between">
                            <p><strong>Phone Number:</strong> </p>
                            <p>{withdrawalDetails.phoneNumber}</p>
                        </div>
                        <div className="flex justify-between">
                            <p><strong>Provider:</strong></p>
                            <p> {withdrawalDetails.provider}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Common details for all withdrawal types */}
            <div className="border-t border-dotted text-xs pt-4 mt-4">
                <div className="flex justify-between">
                    <p><strong>Channel:</strong></p>
                    <p>{withdrawalDetails.type}</p>
                </div>
                <div className="flex justify-between">
                    <p><strong>Amount:</strong></p>
                    <p>{withdrawalDetails.amount} {withdrawalDetails.currency}</p>
                </div>
                <div className="flex justify-between">
                    <p><strong>Status:</strong></p>
                    <p className={`rounded-full px-3  ${statusClasses(withdrawalDetails.status)}`}>
                        {withdrawalDetails.status.charAt(0).toUpperCase() + withdrawalDetails.status.slice(1)}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p><strong>Date:</strong></p>
                    <div>
                        <span className="text-xs  mr-2" style={{ fontStyle: 'italic' }}>
                            {new Date(withdrawalDetails.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                        <span className="text-xs " style={{ fontStyle: 'italic' }}>
                            {new Date(withdrawalDetails.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </span>
                    </div>

                </div>
            </div>

            <div className="mt-4 py-4 border-t text-xs text-gray-600 text-center rounded bg-gray-100">
    <p>If you encounter any issues, please contact support at <a href="mailto:support@verdantcharity.org" className="text-blue-600 hover:text-blue-800">support@verdantcharity.org</a>.</p>
    <div className="flex justify-center items-center mt-2">
        <FaLock className="text-green-600 mr-2" />
        <span>Payment is secured with DLocal</span>
    </div>
    <p className="mt-2">Ravel Global Pay, Apt. 992</p>
    <p>54072 Larson Stravenue, Port Kymside, IA 70661-2925</p>
    <p className="mt-2">For support: <a href="mailto:support@verdantcharity.org" className="text-blue-600 hover:text-blue-800">support@verdantcharity.org</a> | Hotline: +1 800 555 0199</p>
</div>

        </div>
    );

};

export default WithdrawalDetail;


