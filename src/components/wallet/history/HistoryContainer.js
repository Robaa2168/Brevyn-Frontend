import React, { useState } from 'react';
import WithdrawalHistory from './WithdrawalHistory';
import TradeHistory from './TradeHistory';
import TransferHistory from './TransferHistory';

const HistoryContainer = () => {
    const [activeTab, setActiveTab] = useState('withdrawal');

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${
        activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
    }`;

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'withdrawal':
                return <WithdrawalHistory />;
            case 'trade':
                return <TradeHistory />;
            case 'transfer':
                return <TransferHistory />;
            default:
                return <WithdrawalHistory />;
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            {/* Tab buttons */}
            <div className="flex flex-wrap mb-4 border-b">
                <button onClick={() => setActiveTab('withdrawal')} className={tabButtonClass('withdrawal')}>Withdrawal History</button>
                <button onClick={() => setActiveTab('trade')} className={tabButtonClass('trade')}>Trade History</button>
                <button onClick={() => setActiveTab('transfer')} className={tabButtonClass('transfer')}>Transfer History</button>
            </div>
            {/* Render the content of the active tab */}
            {renderActiveTabContent()}
        </div>
    );
};

export default HistoryContainer;
