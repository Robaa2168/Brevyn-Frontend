import React, { useState } from 'react';
import WithdrawalHistory from './WithdrawalHistory';
import TradeHistory from './TradeHistory';
import TransferHistory from './TransferHistory';
import WithdrawalDetail from './WithdrawalDetail';

const HistoryContainer = ({ setActiveComponent }) => {
    const [activeTab, setActiveTab] = useState('withdrawHistory');
    const [selectedwithdrawalId, setSelectedWithdrawId] = useState(null); 

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${
        activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
    }`;

    const handleViewDetails = (withdrawalId) => {
        setSelectedWithdrawId(withdrawalId);
        setActiveTab('withdawdetail');
    };
       // Function to go back to the deposit history from the details view
       const handleBackToHistory = () => {
        setActiveTab('withdrawHistory');
        setSelectedWithdrawId(null);
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            {/* Tab buttons */}
            <div className="flex flex-wrap mb-4 border-b">
            <button onClick={() => setActiveTab('withdrawHistory')} className={tabButtonClass('withdrawHistory')}>Withdrawal History</button>
                <button onClick={() => setActiveTab('tradeHistory')} className={tabButtonClass('tradeHistory')}>Trade History</button>
                <button onClick={() => setActiveTab('transferHistory')} className={tabButtonClass('transferHistory')}>Transfer History</button>
            </div>

            {/* Conditionally render TransferFunds or TransferHistory based on the active tab */}
            {activeTab === 'tradeHistory' && <TradeHistory setActiveComponent={setActiveComponent} />}
            {activeTab === 'transferHistory' && <TransferHistory setActiveComponent={setActiveComponent} />}
            {activeTab === 'withdrawHistory' && <WithdrawalHistory onViewDetails={handleViewDetails} />}
            {activeTab === 'withdawdetail' && selectedwithdrawalId && (
                <WithdrawalDetail withdrawalId={selectedwithdrawalId} onBack={handleBackToHistory} />
            )}
        </div>
    );
};

export default HistoryContainer;
