import React, { useState } from 'react';
import WithdrawalHistory from './WithdrawalHistory';
import TradeHistory from './TradeHistory';
import TransferHistory from './TransferHistory';
import WithdrawalDetail from './WithdrawalDetail';

const HistoryContainer = () => {
    const [activeTab, setActiveTab] = useState('withdrawHistory');
    const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null);

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${
        activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
    }`;

    const handleViewDetails = (withdrawalId) => {
        setSelectedWithdrawalId(withdrawalId);
        // Instead of setting activeTab, directly show WithdrawalDetail by setting selectedWithdrawalId
    };

    const handleBackToHistory = () => {
        setSelectedWithdrawalId(null); // Clear the selectedWithdrawalId to show the list again
    };

    return (
        <>
            {selectedWithdrawalId ? (
                // Render WithdrawalDetail outside the main container or with a different styling/container
                <WithdrawalDetail withdrawalId={selectedWithdrawalId} onBack={handleBackToHistory} />
            ) : (
                // Only render the container with tabs and content if no specific withdrawal ID is selected
                <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
                    {/* Tab buttons */}
                    <div className="flex flex-wrap mb-4 border-b">
                        <button onClick={() => setActiveTab('withdrawHistory')} className={tabButtonClass('withdrawHistory')}>Withdrawal History</button>
                        <button onClick={() => setActiveTab('tradeHistory')} className={tabButtonClass('tradeHistory')}>Trade History</button>
                        <button onClick={() => setActiveTab('transferHistory')} className={tabButtonClass('transferHistory')}>Transfer History</button>
                    </div>
                    
                    {/* Conditional rendering based on the active tab */}
                    <>
                        {activeTab === 'tradeHistory' && <TradeHistory />}
                        {activeTab === 'transferHistory' && <TransferHistory />}
                        {activeTab === 'withdrawHistory' && <WithdrawalHistory onViewDetails={handleViewDetails} />}
                    </>
                </div>
            )}
        </>
    );
    
};

export default HistoryContainer;
