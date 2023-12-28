import React from 'react';
import { Link } from 'react-router-dom'; // assuming you're using react-router

// Dummy data for donation links
const links = [
    {
        id: 1,
        title: "Help the Homeless",
        description: "We are raising funds to help homeless people in our city.",
        status: "active",
        uniqueIdentifier: "12345",
    },
    // Add more links as needed
];

const MyDonationLinks = () => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-lg font-bold mb-4 text-emerald-700">My Donation Links</h2>
            <div className="space-y-4">
                {links.map(link => (
                    <div key={link.id} className="p-4 border border-emerald-500 rounded">
                        <h3 className="text-md font-semibold">{link.title}</h3>
                        <p className="mb-2">{link.description}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${link.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                            {link.status}
                        </span>
                        <div className="mt-4">
                            <Link to={`/preview/${link.uniqueIdentifier}`} className="px-4 py-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded transition duration-300">
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyDonationLinks;
