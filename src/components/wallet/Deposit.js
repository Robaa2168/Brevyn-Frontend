import React from 'react';
import Lottie from "lottie-react";
import unavailableAnimation from '../lottie/noLinks.json'; 

const Deposit = () => {
    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md text-center ">
            <h2 className="text-lg font-bold mb-4">Make a Deposit</h2>
            {/* Lottie animation and message */}
            <div className="flex flex-col items-center justify-center">
                <Lottie animationData={unavailableAnimation} style={{ width: 200, height: 200 }} />
                <p style={{
    backgroundColor: 'rgba(255, 206, 86, 0.2)',
    borderColor: 'rgba(255, 206, 86, 1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '16px', // adjust as needed
    borderRadius: '4px', // adjust as needed
    fontSize: '14px', // adjust as needed
    color: '#424242' // adjust as needed
}}>
Currently, direct deposit services are unavailable in your country. We invite you to visit our marketplace to purchase impact points as an alternative.
</p>


            </div>
        </div>
    );
};

export default Deposit;
