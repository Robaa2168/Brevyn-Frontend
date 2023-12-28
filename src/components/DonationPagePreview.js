import React from 'react';
import { useParams } from 'react-router-dom'; // assuming you're using react-router

const DonationPagePreview = () => {
    const { uniqueIdentifier } = useParams();
    // Assuming we get the link details based on the uniqueIdentifier
    // Here's dummy data for a specific link preview
    const link = {
        title: "Help the Homeless",
        description: "We are raising funds to help homeless people in our city.",
        status: "active",
    };

    // Functions to handle delete and deactivate
    const handleDelete = () => {
        console.log("Delete Link");
        // Implement deletion logic here
    };

    const handleDeactivate = () => {
        console.log("Deactivate Link");
        // Implement deactivate logic here
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-lg font-bold mb-4 text-emerald-700">{link.title}</h2>
            <p className="mb-4">{link.description}</p>
            <div className="flex justify-between items-center">
                <button onClick={handleDeactivate} className="px-4 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded transition duration-300">
                    Deactivate
                </button>
                <button onClick={handleDelete} className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition duration-300">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DonationPagePreview;
