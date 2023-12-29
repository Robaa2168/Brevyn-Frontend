import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useHistory for navigation
import { useUser } from './context';
import api from '../api';
import Sidebar from './Sidebar';
import { FaCopy, FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import Lottie from 'lottie-react';
import loadingAnimation from './lottie/loading.json';


function truncateURL(url, maxLength) {
    // Define the length for the start and end strings
    const startChars = 15; 
    const endChars = maxLength - startChars; // Reserve the rest for the end

    if (url.length <= maxLength) {
        return url; // No need to truncate
    }

    // Extracting the start and end parts of the URL
    const start = url.substring(0, startChars);
    const end = url.substring(url.length - endChars);

    // Return the truncated URL
    return `${start}.../${end}`;
}

const DonationsPreviewPage = () => {
    const { id: linkId } = useParams();
    const [linkData, setLinkData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const userToken = user?.token;
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [action, setAction] = useState('');
    const [copySuccess, setCopySuccess] = useState('');


    useEffect(() => {
        const fetchDonationLinkData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/donations/donation-link/${linkId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                setLinkData(response.data);
            } catch (error) {
                console.error("Error fetching donation link data: ", error);
            }
            setIsLoading(false);
        };

        fetchDonationLinkData();
    }, [linkId, userToken]);

    const calculateProgress = () => {
        if (linkData) {
            const progress = (linkData.totalDonations / linkData.targetAmount) * 100;
            return Math.min(progress, 100); // Ensuring it doesn't go over 100%
        }
        return 0; // Default to 0 if no data
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        setError('');
        setAction('deleting');

        try {
            const response = await api.delete(`/delete-link/${linkData.id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                console.log('Donation link deleted successfully');
                // Here, instead of redirecting, update UI to reflect deletion
                setLinkData(null); // Assuming you use null or similar logic when a link is deleted
            } else {
                throw new Error('Failed to delete donation link');
            }
        } catch (error) {
            console.error('Failed to delete donation link:', error);
            setError('Failed to delete donation link. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusToggle = async () => {
        setIsSubmitting(true);
        setError('');
        setAction(linkData?.status === 'active' ? 'deactivating' : 'activating');

        try {
            const response = await api.patch(`/api/donations/toggle-status/${linkData._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                console.log('Donation link status toggled successfully');
                // Update the local state to reflect the new status
                setLinkData({ ...linkData, status: response.data.status });
            } else {
                throw new Error('Failed to toggle the status of the donation link');
            }
        } catch (error) {
            console.error('Failed to toggle status:', error);
            setError('Failed to change the status of the donation link. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


  
    
        const handleCopyClick = async () => {
            try {
                await navigator.clipboard.writeText(`https://brevyn.vercel.app/donate/${linkData.uniqueIdentifier}`);
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            } catch (err) {
                setCopySuccess('Failed to copy!');
            }
        };
     

    return (
        <div className="bg-emerald-50 min-h-screen pb-20 flex flex-col">
            <div className="container mx-auto px-2 sm:px-4 lg:flex lg:flex-row rounded-lg border border-gray-200">
                <Sidebar />
                <div className="flex-grow mx-2 sm:mx-4 my-4 sm:my-8 p-2 sm:p-4 py-4 sm:py-8 bg-white rounded-lg border border-gray-200 flex flex-col shadow-sm">
                    <div className="w-full max-w-3xl mx-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-4">
                                <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                            </div>
                        ) : linkData ? (
                            <div className="border border-emerald-500 rounded-lg p-6 space-y-4">
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 text-center overflow-hidden whitespace-nowrap text-ellipsis">{linkData.title}</h2>
                                {error && (
                                    <div className="mb-4 p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
                                        {error}
                                    </div>
                                )}
                                <p className="text-md mb-4 text-gray-600 text-center">{linkData.description}</p>
                                {/* Stats with a subtle background */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 bg-emerald-100 p-4 rounded-lg">
                                    <p>Total Donations: ${linkData.totalDonations}</p>
                                    <p>Target Amount: ${linkData.targetAmount}</p>
                                    <p className="text-xs mb-4">
                                        Status: <span className={linkData.status === 'active' ? 'text-gray-600' : 'font-semibold text-red-600'}>
                                            {linkData.status}
                                        </span>
                                    </p>

                                    <p>Views: {linkData.views}</p>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    {/* Progress Bar and Percentage */}
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-4">
                                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                                    </div>
                                    <span className="text-xs font-semibold">{`${calculateProgress().toFixed(2)}%`}</span>
                                </div>
                               {/* Constructed URL and Copy to Clipboard Section */}
{/* Constructed URL and Copy to Clipboard Section */}
<div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
    <span className="text-xs font-medium shrink-0">Donation Link:</span>
    <div className="flex bg-gray-100 p-2 rounded items-center">
        {/* Content fitting div */}
        <span className="text-xs block overflow-hidden text-ellipsis whitespace-nowrap sm:text-sm">
            {truncateURL(`https://brevyn.vercel.app/donation/${linkData.uniqueIdentifier}`, 25)}  
        </span>
        <button onClick={handleCopyClick} className="ml-2 text-blue-500 hover:text-blue-700 transition duration-200">
            <FaCopy />
        </button>
    </div>
    {copySuccess && <span className="text-green-500 text-xs">{copySuccess}</span>}
</div>


                                {/* Outline Action Buttons */}
<div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-end">
    <button
        onClick={handleStatusToggle}
        disabled={isSubmitting}
        className="flex items-center justify-center text-xs px-3 py-1 text-blue-500 border border-blue-500 rounded hover:bg-blue-100 transition duration-200 ease-in-out"
    >
        {isSubmitting && action !== '' ? <FaSpinner className="mr-2 animate-spin" /> : linkData?.status === 'active' ? <FaToggleOff className="mr-2" /> : <FaToggleOn className="mr-2" />}
        {isSubmitting && action === 'deactivating' ? 'Deactivating...' : isSubmitting && action === 'activating' ? 'Activating...' : linkData?.status === 'active' ? 'Deactivate' : 'Activate'}
    </button>
    <button
        onClick={() => navigate(`/link/edit/${linkData._id}`)}
        disabled={isSubmitting}
        className="flex items-center justify-center text-xs px-3 py-1 text-green-500 border border-green-500 rounded hover:bg-green-100 transition duration-200 ease-in-out"
    >
        <FaEdit className="mr-2" />Edit
    </button>
    <button
        onClick={handleDelete}
        disabled={isSubmitting}
        className="flex items-center justify-center text-xs px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-100 transition duration-200 ease-in-out"
    >
        {isSubmitting && action === 'deleting' ? <FaSpinner className="mr-2 animate-spin" /> : <FaTrashAlt className="mr-2" />}
        {isSubmitting && action === 'deleting' ? 'Deleting...' : 'Delete'}
    </button>
</div>


                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-gray-500">No data available for this donation link</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationsPreviewPage;