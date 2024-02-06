import React, { useState } from 'react';
import Deposit from './Deposit';
import DepositHistory from './DepositHistory';
import DepositDetail from './DepositDetail'; // Import the DepositDetail component
import { FaLock } from 'react-icons/fa';

const DepositContainer = ({ setActiveComponent }) => {
    const [activeTab, setActiveTab] = useState('deposit');
    const [selectedDepositId, setSelectedDepositId] = useState(null); 

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${
        activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
    }`;

    // Function to handle selecting a deposit to view details
    const handleViewDetails = (depositId) => {
        setSelectedDepositId(depositId);
        setActiveTab('detail');
    };

    // Function to go back to the deposit history from the details view
    const handleBackToHistory = () => {
        setActiveTab('history');
        setSelectedDepositId(null);
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md space-y-4">
            {/* Tab buttons */}
            <div className="flex flex-wrap mb-4 border-b">
                <button onClick={() => setActiveTab('deposit')} className={tabButtonClass('deposit')}>Deposit</button>
                <button onClick={() => setActiveTab('history')} className={tabButtonClass('history')}>Deposit History</button>
            </div>

            {/* Conditionally render Deposit, DepositHistory, or DepositDetail based on the active tab */}
            {activeTab === 'deposit' && <Deposit setActiveComponent={setActiveComponent} />}
            {activeTab === 'history' && <DepositHistory onViewDetails={handleViewDetails} />}
            {activeTab === 'detail' && selectedDepositId && (
                <DepositDetail depositId={selectedDepositId} onBack={handleBackToHistory} />
            )}

            {/* Security Information Section */}
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center text-gray-700">
                <FaLock className="text-green-500 mb-2" size={24} />
                <p>Payment is secured with DLocal</p>
                <p className="text-xs mt-2">Ravel Global Pay, Apt. 992 54072 Larson Stravenue, Port Kymside, IA 70661-2925</p>
                <p className="text-xs">For support: <a href="mailto:support@ravelmobile.com" className="text-blue-500">support@ravelmobile.com</a> | Hotline: <a href="tel:+18005550199" className="text-blue-500">+1 800 555 0199</a></p>
            </div>
        </div>
    );
};

export default DepositContainer;
