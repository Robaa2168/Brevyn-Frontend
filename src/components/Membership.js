// Membership.js
import React from 'react';

const Membership = () => {

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg ">
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
            <p className="text-green-500 text-xl font-bold mb-4 text-center">300 Points/year</p>
            <ul className="text-xs mb-6 text-center">
                <li>Create unlimited donation links</li>
                <li>Withdraw donations</li>
                <li>Join unlimited volunteer programs</li>
                <li>Eligibility to apply for grants</li>
            </ul>
        </div>
        <button className="bg-emerald-500 text-white text-xs py-2 px-4 rounded hover:bg-emerald-600 transition duration-300 w-full mt-4">
            Upgrade to Premium
        </button>
    </div>
</div>

        </div>
    );
};

export default Membership;
