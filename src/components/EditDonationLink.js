import React, { useState, useEffect } from 'react';
import api from '../api';
import Sidebar from './Sidebar';
import Lottie from "lottie-react";
import successAnimation from "./lottie/success-animation.json";
import successConfetti from './lottie/success-confetti.json';
import { useUser } from "./context";
import { useParams, useNavigate } from 'react-router-dom';
import ChangePassword  from './ChangePassword';
import DonationsSummary from './DonationsSummary';
import MyDonations from './MyDonations'; 
import VolunteerActivities from './VolunteerActivities'; 
import Profile from './Profile';
import Membership from './Membership';
import Wallet from './wallet/Wallet';
import Kyc from './Kyc';


const EditDonationLink = ({ setShowEditLink }) => {
    const [activeComponent, setActiveComponent] = useState('donationsSummary');
    const { user } = useUser();
    const navigate = useNavigate();
    const { id: linkId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);



      // Object to map component keys to component render functions
  const componentMap = {
    donationsSummary: <DonationsSummary setActiveComponent={setActiveComponent} />,
    myDonations: <MyDonations />,
    volunteerActivities:<VolunteerActivities />,
    changePassword:<ChangePassword  />,
    profile:<Profile />,
    membership:<Membership />,
    wallet:<Wallet />,
    kyc:<Kyc />,
  };


    useEffect(() => {
        // Fetch the donation link data and populate the form when the component mounts
        const fetchDonationLinkData = async () => {
            try {
                const response = await api.get(`/api/donations/donation-link/${linkId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                setFormData({
                    title: response.data.title,
                    targetAmount: response.data.targetAmount,
                    description: response.data.description,
                });
            } catch (error) {
                setError('Failed to fetch donation link data.');
            }
        };

        fetchDonationLinkData();
    }, [linkId, user.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await api.patch(`/api/donations/edit-link/${linkId}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                setIsSuccessful(true);
            } else {
                setError('Failed to update donation link. Please try again.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-emerald-50 min-h-screen pb-20">
            <div className="lg:flex lg:flex-row p-4 rounded-lg border border-gray-200">
            
                <div className="container mx-auto mt-5 p-4 bg-white max-w-3xl rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Edit Donation Link</h2>

                    {/* Error message display */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
                            {error}
                        </div>
                    )}

                    {/* Form for editing the donation link */}
                    {!isSuccessful ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-xs sm:text-xs">Title for the Donation</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Enter title"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-xs sm:text-xs">Target Amount ($)</label>
                                <input
                                    type="number"
                                    name="targetAmount"
                                    value={formData.targetAmount}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Enter target amount"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-xs sm:text-xs">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-2 border rounded text-xs sm:text-xs  focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Describe the purpose of the donation"
                                ></textarea>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded"
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Link'}
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition duration-300 py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex  flex-col items-center justify-center w-full p-2">
                            {/* Success Animations */}
                            <div className="relative  w-full h-64">
                                <Lottie animationData={successConfetti} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                                <Lottie animationData={successAnimation} style={{ position: 'absolute', width: '100%', height: '100%' }} />
                            </div>
                            {/* Success Message */}
                            <p className="text-lg font-semibold text-emerald-700 mt-4 text-center">Donation Link Created Successfully!</p>

                            <button
                                onClick={() => navigate(-1)}
                                className="mt-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition duration-300 py-2 px-4 rounded text-sm bg-emerald-500 bg-opacity-10"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditDonationLink;
