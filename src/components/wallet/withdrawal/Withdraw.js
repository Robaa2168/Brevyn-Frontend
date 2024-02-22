import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BankWithdrawal from './BankWithdrawal';
import PaypalWithdrawal from './PaypalWithdrawal';
import MobileWithdrawal from './MobileWithdrawal';
import BonusWithdrawal from './BonusWithdrawal';

const Withdraw = () => {
    const [activeTab, setActiveTab] = useState('bank');
    const navigate = useNavigate();
    const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
    const userBalance = 100; // Assume this comes from context or props

    useEffect(() => {
        if (userBalance > 50) {
            setIsBonusModalOpen(true);
        }
    }, [userBalance]);

    const closeModal = () => {
        setIsBonusModalOpen(false);
    };

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'}`;

    const renderComponent = () => {
        switch (activeTab) {
            case 'bank':
                return <BankWithdrawal />;
            case 'paypal':
                return <PaypalWithdrawal />;
            case 'mobile':
                return <MobileWithdrawal />;
            case 'bonus':
                return <BonusWithdrawal />;
            default:
                return <BankWithdrawal />;
        }
    };

    const goToBonusWithdrawal = () => {
        setActiveTab('bonus');
        closeModal();
    };

    const goToHelpPage = () => {
        navigate('/help');
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            {/* Tab buttons */}
            <div className="flex flex-wrap mb-4 border-b">
                <button onClick={() => setActiveTab('bank')} className={tabButtonClass('bank')}>Bank</button>
                <button onClick={() => setActiveTab('paypal')} className={tabButtonClass('paypal')}>PayPal</button>
                <button onClick={() => setActiveTab('mobile')} className={tabButtonClass('mobile')}>Mobile Money</button>
            </div>
            {/* Tailwind Modal */}
            {isBonusModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-6 max-w-md mx-auto">
                        <h2 className="text-sm font-semibold text-gray-800">Bonus About to Expire</h2>
                        <p className="my-4 text-xs text-gray-600">Your bonus balance is about to expire. Withdraw it now!</p>
                        <div className="flex justify-between space-x-4">
                            <button onClick={goToBonusWithdrawal} className="flex-grow bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded focus:outline-none transition duration-150 ease-in-out text-xs font-medium">Withdraw Now</button>
                            <button onClick={closeModal} className="flex-grow bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none transition duration-150 ease-in-out text-xs font-medium">Later</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rest of the component */}
           
            {renderComponent()}
            <div className="text-center mt-6">
                <p className="text-gray-600 text-sm mb-2">Need assistance with your transaction?</p>
                <button onClick={goToHelpPage} className="text-emerald-500 hover:text-emerald-600 text-sm underline">Visit our Help Center</button>
            </div>
        </div>
    );
};

export default Withdraw;
