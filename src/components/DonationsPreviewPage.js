import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from './context';
import api from '../api';
import SidebarCommon from './SidebarCommon';
import { FaCopy, FaShareAlt, FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import Lottie from 'lottie-react';
import loadingAnimation from './lottie/loading.json';
import Modal from 'react-modal';


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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const donationUrl = `https://verdantcharity.org/donate/${linkData?.uniqueIdentifier}`;

    const handleCopyClick = async () => {
        try {
            await navigator.clipboard.writeText(donationUrl);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };

    const handleShareClick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Support our cause!",
                    text: "Check out this donation link and help support a great cause!",
                    url: donationUrl,
                });
            } catch (error) {
                toast.error("Error sharing: " + error);
            }
        } else {
            // Fallback if Web Share API is not supported
            handleCopyClick();
        }
    };



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
            const response = await api.delete(`/api/donations/delete-link/${linkData._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                console.log('Donation link deleted successfully');
                // Navigate back after successful deletion
                navigate(-1);
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


    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    // Close modal function
    const closeModal = () => {
        setIsModalOpen(false);
        setAction("");
    };

    // Confirm action inside modal
    const confirmAction = async () => {
        if (modalType === "delete") {
            await handleDelete(); // call delete function
        } else if (modalType === "deactivate") {
            await handleStatusToggle(); // call deactivate function
        }
        closeModal(); // Close the modal after action
    };

    return (
        <div className="bg-emerald-50 min-h-screen pb-20 flex flex-col">
             <ToastContainer position="top-center" />
            <div className="container mx-auto px-2 sm:px-4 lg:flex lg:flex-row rounded-lg border border-gray-200">
                <SidebarCommon />
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
                                <div className="flex justify-center py-4">
                                    <img
                                        src={linkData.image || 'defaultImage.jpg'}
                                        alt="Donation"
                                        className="max-w-md max-h-60 w-full object-cover rounded-lg shadow-lg"
                                        style={{ minHeight: '30vh' }} // Use viewport height for responsive design
                                    />
                                </div>

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
                                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                    <span className="text-xs font-medium shrink-0">Donation Link:</span>
                                    <div className="flex bg-gray-100 p-2 rounded items-center">
                                        {/* Content fitting div */}
                                        <span className="text-xs block overflow-hidden text-ellipsis whitespace-nowrap sm:text-sm">
                                            {truncateURL(`https://verdantcharity.org/donation/${linkData.uniqueIdentifier}`, 22)}
                                        </span>
                                        <button onClick={handleCopyClick} className="ml-2 text-blue-500 hover:text-blue-700 transition duration-200">
                                            <FaCopy />
                                        </button>
                                        <button onClick={handleShareClick} className="ml-2 text-blue-500 hover:text-blue-700 transition duration-200">
                                            <FaShareAlt />
                                        </button>
                                    </div>
                                    {copySuccess && <span className="text-green-500 text-xs">{copySuccess}</span>}
                                </div>


                                {/* Outline Action Buttons */}
                                <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-end">
                                    <button
                                        onClick={() => openModal("deactivate")}
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
                                    {/*
                                    <button
                                        onClick={() => openModal("delete")}
                                        disabled={isSubmitting}
                                        className="flex items-center justify-center text-xs px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-100 transition duration-200 ease-in-out"
                                    >
                                        {isSubmitting && action === 'deleting' ? <FaSpinner className="mr-2 animate-spin" /> : <FaTrashAlt className="mr-2" />}
                                        {isSubmitting && action === 'deleting' ? 'Deleting...' : 'Delete'}
                                    </button>
                                */}
                                </div>


                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-sm text-gray-500">No data available for this donation link</p>
                            </div>
                        )}
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        className="fixed inset-0 overflow-y-auto" // Ensures modal is fixed and centered
                    >
                        <div className="flex items-center justify-center min-h-screen text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            {/* Modal content */}
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full mx-4 md:mx-8 p-4 border border-gray-300 bg-gray-50">

                                <div style={{ textAlign: 'center' }}>
                                    <h2 style={{ color: '#50c878' }}>
                                        {
                                            modalType === "delete" ?
                                                "Are you sure you want to delete this donation link?" :
                                                `Are you sure you want to ${linkData?.status === "active" ? "deactivate" : "activate"} this donation link?`
                                        }
                                    </h2>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                                        {isSubmitting && (
                                            <>
                                                <FaSpinner className="animate-spin" style={{ marginRight: '10px' }} />
                                                {
                                                    modalType === "deactivate" ?
                                                        <span>{linkData?.status === "active" ? "Deactivating..." : "Activating..."}</span> :
                                                        modalType === "delete" &&
                                                        <span style={{ color: 'red' }}>Deleting...</span> // Deleting... in red
                                                }
                                            </>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                        <button onClick={confirmAction} style={{ backgroundColor: '#50c878', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Yes</button>
                                        <button onClick={closeModal} style={{ backgroundColor: '#c4c4c4', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>No</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Modal>

                </div>
            </div>
        </div>
    );
};

export default DonationsPreviewPage;