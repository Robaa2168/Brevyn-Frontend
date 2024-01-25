// DonationsSummary.js
import React, { useState } from 'react';
import DonationChart from './DonationChart';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdAdd } from 'react-icons/md';
import CreateDonationLink from './CreateDonationLink';
import SummaryCards from './SummaryCards';
import { useUser } from "./context";
import Lottie from "lottie-react";
import emptyAnimation from "./lottie/Empty-box.json";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonationsSummary = ({ setActiveComponent }) => {
    const { user, login } = useUser();
    const [showCreateLink, setShowCreateLink] = useState(false);


    // Dummy data for the chart
    const data = {
        labels: ['Individuals', 'Foundations', 'Corporations'],
        datasets: [
            {
                data: [29850, 8500, 2062], // Example data, replace with real data
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', // for Individuals
                    'rgba(54, 162, 235, 0.2)', // for Foundations
                    'rgba(255, 206, 86, 0.2)', // for Corporations
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)', // for Individuals
                    'rgba(54, 162, 235, 1)', // for Foundations
                    'rgba(255, 206, 86, 1)', // for Corporations
                ],
                borderWidth: 1,
            },
        ],
    };

    const totalDonations = data.datasets[0].data.reduce((a, b) => a + b, 0);


    const handleCreateLinkClick = () => {
        if (user?.primaryInfo?.firstName && user?.primaryInfo?.lastName) {
            setShowCreateLink(true); 
        } else {
            setActiveComponent('kyc');
        }
    };

    return (
        <>
            <SummaryCards />
            <div className="p-4 mt-8 bg-white rounded-lg shadow-md">
                {/* Conditional rendering based on showCreateLink */}
                {!showCreateLink ? (
                    <>
                        <h1 className="text-lg sm:text-lg text-gray-700 font-bold mb-4">Donation Summary</h1>

                        {totalDonations > 0 ? (
                            <DonationChart data={data} />
                        ) : (
                            <div className="flex flex-col justify-center items-center h-64">
                                <Lottie animationData={emptyAnimation} style={{ width: 200, height: 200 }} />
                                <p className="text-gray-500 font-semibold mt-4">No data yet</p> {/* Centered message */}
                            </div>
                        )}

<div className="text-left mt-4">
    <button
        onClick={handleCreateLinkClick}
        className="w-full text-sm sm:w-auto border border-emerald-500 text-emerald-500 px-4 py-1 rounded hover:bg-emerald-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-300 inline-flex items-center justify-center"
    >
        <MdAdd className="mr-2 text-xs" size={24} />
        Create Fund Me Link
    </button>
</div>

                    </>
                ) : (
                    <CreateDonationLink setShowCreateLink={setShowCreateLink} />
                )}
            </div>
        </>
    );
};

export default DonationsSummary;
