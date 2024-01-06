// Membership.js
import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { toast, ToastContainer } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import { useUser } from "./context";

const Membership = () => {
    const { user, login } = useUser();
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); 

    const handleUpgrade = async () => {
        setIsUpgrading(true);

        try {
            const response = await api.patch('/api/auth/upgrade-membership', {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Membership upgraded to Premium successfully!");
                login({ ...user, isPremium: true });
                setShowConfetti(true); // Show confetti on successful upgrade
                setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
            } else {
                toast.error("Failed to upgrade membership.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during the upgrade.");
        } finally {
            setIsUpgrading(false);
        }
    };


    return (
        <div className="container mx-auto p-4 bg-white rounded-lg ">
            <ToastContainer position="top-center" />
            {showConfetti && <Confetti />}
            <h2 className="text-lg font-bold mb-4">Membership</h2>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4">
                {/* Free Tier Card */}
                <div className="border rounded-lg p-6 flex flex-col justify-between flex-1">
                    <div>
                        <h3 className="text-md font-extrabold mb-4 text-center">Free Tier</h3>
                        <p className="text-green-500 text-xl font-bold mb-4 text-center">Free</p>
                        <ul className="text-xs mb-6 text-center">
                            <li>Participate in 1 volunteer program</li>
                            <li>Create 1 donation link</li>
                            <li>No access to grants</li>
                        </ul>
                    </div>
                    <button className="bg-gray-300 text-gray-700 text-xs py-2 px-4 rounded hover:bg-gray-400 transition duration-300 w-full mt-4">
                        Stay on Free
                    </button>
                </div>

                {/* Premium Tier Card */}
                <div className="border rounded-lg p-6 flex flex-col justify-between  flex-1">
                    <div>
                        <h3 className="text-md font-extrabold mb-4 text-center">Premium Tier</h3>
                        <p className="text-green-500 text-xl font-bold mb-4 text-center">50 Points/year</p>
                        <ul className="text-xs mb-6 text-center">
                            <li>Create unlimited donation links</li>
                            <li>Withdraw donations</li>
                            <li>Join unlimited volunteer programs</li>
                            <li>Eligibility to apply for grants</li>
                        </ul>
                    </div>
                    <button
                        onClick={handleUpgrade}
                        disabled={isUpgrading || user.isPremium}
                        className={`w-full text-xs py-2 px-4 rounded transition duration-300 ${user.isPremium ? "bg-gray-400" : isUpgrading ? "bg-emerald-300" : "bg-emerald-500 hover:bg-emerald-600"} text-white`}>
                        {isUpgrading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 inline" />
                                Upgrading...
                            </>
                        ) : user.isPremium ? (
                            "Upgraded"
                        ) : (
                            "Upgrade to Premium"
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Membership;
