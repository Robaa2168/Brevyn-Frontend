import React, { useState } from 'react';
import TransferFunds from './TransferFunds';
import TransferHistory from './TransferHistory';
import TransferDetail from './TransferDetail';

const TransferContainer = ({ setActiveComponent }) => {
    const [activeTab, setActiveTab] = useState('transfer');
    const [selectedTransferId, setSelectedTransferId] = useState(null); 

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${
        activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
    }`;

    const handleViewDetails = (transferId) => {
        setSelectedTransferId(transferId);
        setActiveTab('detail');
    };
       // Function to go back to the deposit history from the details view
       const handleBackToHistory = () => {
        setActiveTab('transfer');
        setSelectedTransferId(null);
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            {/* Tab buttons */}
            <div className="flex flex-wrap mb-4 border-b">
                <button onClick={() => setActiveTab('transfer')} className={tabButtonClass('transfer')}>Transfer Funds</button>
                <button onClick={() => setActiveTab('history')} className={tabButtonClass('history')}>Transfer History</button>
            </div>

            {/* Conditionally render TransferFunds or TransferHistory based on the active tab */}
            {activeTab === 'transfer' && <TransferFunds setActiveComponent={setActiveComponent} />}
            {activeTab === 'history' && <TransferHistory onViewDetails={handleViewDetails} />}
            {activeTab === 'detail' && selectedTransferId && (
                <TransferDetail transferId={selectedTransferId} onBack={handleBackToHistory} />
            )}
        </div>
    );
};

export default TransferContainer;
