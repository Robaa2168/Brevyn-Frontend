import React, { useState } from 'react';
import Convert from './Convert';
import ConvertHistory from './ConvertHistory';

const ConversionContainer = ({ setActiveComponent }) => {
    const [activeTab, setActiveTab] = useState('convert');

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${
        activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
    }`;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            {/* Tab buttons */}
            <div className="flex flex-wrap mb-4 border-b">
                <button onClick={() => setActiveTab('convert')} className={tabButtonClass('convert')}>Convert</button>
                <button onClick={() => setActiveTab('history')} className={tabButtonClass('history')}>Conversion History</button>
            </div>

            {/* Conditionally render Convert or ConvertHistory based on the active tab */}
            {activeTab === 'convert' &&  <Convert setActiveComponent={setActiveComponent} />}
            {activeTab === 'history' && <ConvertHistory />}
        </div>
    );
};

export default ConversionContainer;
