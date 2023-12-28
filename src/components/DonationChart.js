import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonationChart = ({ data }) => {
    return (
        <div className="w-full sm:w-auto h-64">
            <Doughnut data={data} options={{ maintainAspectRatio: false, responsive: true }} />
        </div>
    );
};

export default DonationChart;
