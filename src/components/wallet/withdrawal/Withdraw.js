import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BankWithdrawal from './BankWithdrawal';
import PaypalWithdrawal from './PaypalWithdrawal';
import MobileWithdrawal from './MobileWithdrawal';
import { FaLock } from 'react-icons/fa';

const Withdraw = () => {
    const [activeTab, setActiveTab] = useState('bank');
    const navigate = useNavigate();

    const tabButtonClass = (tabName) => `w-full sm:w-auto py-2 px-4 border-b-2 font-medium text-sm sm:text-base ${
        activeTab === tabName ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:border-gray-300 hover:text-gray-600'
    }`;

    const renderComponent = () => {
        switch(activeTab) {
            case 'bank':
                return <BankWithdrawal />;
            case 'paypal':
                return <PaypalWithdrawal />;
            case 'mobile':
                return <MobileWithdrawal />;
            default:
                return <BankWithdrawal />;
        }
    };

    const goToHelpPage = () => {
        navigate('/help'); // Navigates to the help page
    };

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            {/* Tab buttons */}
            <div className="flex flex-wrap mb-4 border-b">
                <button onClick={() => setActiveTab('bank')} className={tabButtonClass('bank')}>Bank</button>
                <button onClick={() => setActiveTab('paypal')} className={tabButtonClass('paypal')}>PayPal</button>
                <button onClick={() => setActiveTab('mobile')} className={tabButtonClass('mobile')}>Mobile Money</button>
            </div>
                                      {/* Centered small image */}
    <div className="flex justify-center">
        <img src="https://cdn-icons-png.flaticon.com/256/848/848533.png" alt="Withdrawal Icon" className="w-24 h-auto mb-1" /> {/* Adjust the w-24 class as needed for your image size */}
    </div>
            {renderComponent()}
       {/* Additional section for help/assistance 
       <div className="text-center mt-6">
        
                <p className="text-gray-600 text-sm mb-2">Need assistance with your transaction?</p>
                
                <button
                    onClick={goToHelpPage}
                    className="text-emerald-500 hover:text-emerald-600 text-sm underline"
                >
                    Visit our Help Center
                </button>
            
            </div>
            */}

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

export default Withdraw;