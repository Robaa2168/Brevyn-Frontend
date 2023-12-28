import React from 'react';
import Lottie from "lottie-react";
import unavailableAnimation from '../lottie/noLinks.json';

const History = () => {
    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md text-center ">
            <h2 className="text-lg font-bold mb-4">History</h2>
            {/* Lottie animation and message */}
            <div className="flex flex-col items-center justify-center">
                <Lottie animationData={unavailableAnimation} style={{ width: 200, height: 200 }} />
                <p className="text-gray-500 font-semibold mt-4">
                    No Records Found
                </p>
            </div>
        </div>
    );
};

export default History;
