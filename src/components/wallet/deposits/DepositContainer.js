import React, { useState } from 'react';
import Deposit from './Deposit';
import DepositHistory from './DepositHistory';
import DepositDetail from './DepositDetail'; // Import the DepositDetail component
import { FaLock } from 'react-icons/fa';

const DepositContainer = ({ setActiveComponent }) => {
    const [activeTab, setActiveTab] = useState('deposit');
    const [selectedDepositId, setSelectedDepositId] = useState(null);

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
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
            <div className="mt-4 py-4 border-t text-xs text-gray-600 text-center rounded bg-gray-100">
                <div className="flex justify-center items-center mt-2">
                    <FaLock className="text-green-600 mr-2" />
                    <span>Payment is secured with DLocal</span>
                </div>
                <p className="mt-2">Ravel Global Pay, Apt. 992</p>
                <p>54072 Larson Stravenue, Port Kymside, IA 70661-2925</p>
                <p className="mt-2">For support: <a href="mailto:support@verdantcharity.org" className="text-blue-600 hover:text-blue-800">support@verdantcharity.org</a> | Hotline: +1 800 555 0199</p>
            </div>
        </div>
    );
};

export default DepositContainer;
