// WalletSidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AiOutlineSwap,
    AiOutlineHistory,
    AiOutlineDollarCircle,
    AiOutlineShoppingCart,
    AiOutlineLogout,
    AiOutlineHome,
} from 'react-icons/ai';

const WalletSidebar = ({ changeComponent }) => {
    const [activeComponent, setActiveComponent] = useState('donationsSummary'); // Initialize the active component state

    const handleClick = (componentName) => {
        setActiveComponent(componentName); // Update the active component state
        changeComponent(componentName);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mx-4 lg:mx-8 lg:rounded-none lg:h-full lg:w-64 mt-4 md:mt-8 lg:mt-16">
            <nav className="flex flex-col space-y-3">
                {/* Link back to dashboard */}
                <Link
                    to="/dashboard"
                    onClick={() => handleClick('donationsSummary')}
                    className={`flex items-center space-x-3 cursor-pointer ${
                        activeComponent === 'donationsSummary'
                          ? 'p-2 rounded-md text-emerald-700 bg-emerald-100'
                          : 'text-gray-700'
                      }`}
                    >
                    <AiOutlineHome className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Home</span>
                </Link>

                {/* Withdraw */}
                <div
                    onClick={() => handleClick('withdraw')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'withdraw' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineDollarCircle className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Withdraw</span>
                </div>

                {/* Convert */}
                <div
                    onClick={() => handleClick('convert')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'convert' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineSwap className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Convert</span>
                </div>

                {/* History */}
                <div
                    onClick={() => handleClick('history')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'history' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineHistory className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">History</span>
                </div>

                {/* Deposit */}
                <div
                    onClick={() => handleClick('deposit')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'deposit' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineDollarCircle className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Deposit</span>
                </div>

               {/* Market Place */}
<div
  onClick={() => handleClick('marketPlace')}
  className={`flex items-center space-x-3 cursor-pointer ${
    activeComponent === 'marketPlace' ? 'text-emerald-500' : 'text-gray-700'
  }`}
>
  <div className="">
    <AiOutlineShoppingCart className="text-xl sm:text-2xl" />
  </div>
  <span className="text-xs sm:text-sm pulse-dot">Market Place</span>
</div>


                {/* Logout */}
                <div
                    onClick={() => handleClick('logout')}
                    className={`flex items-center space-x-3 cursor-pointer ${activeComponent === 'logout' ? 'text-emerald-500' : 'text-gray-700'
                        }`}
                >
                    <AiOutlineLogout className="text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Logout</span>
                </div>
            </nav>
        </div>
    );
};

export default WalletSidebar;
