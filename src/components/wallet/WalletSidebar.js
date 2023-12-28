// WalletSidebar.js
import React from 'react';
import { AiOutlineSwap, AiOutlineHistory, AiOutlineDollarCircle, AiOutlineShoppingCart,AiOutlineLogout } from 'react-icons/ai'; // Import necessary icons

const WalletSidebar = ({ changeComponent }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow mx-4 lg:mx-8 lg:rounded-none lg:h-full lg:w-64 mt-4 md:mt-8 lg:mt-16">
            <nav className="flex flex-col space-y-3">
                {/* Withdraw */}
                <div onClick={() => changeComponent('withdraw')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
                    <AiOutlineDollarCircle className="text-emerald-500 text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Withdraw</span>
                </div>

                {/* Convert */}
                <div onClick={() => changeComponent('convert')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
                    <AiOutlineSwap className="text-emerald-500 text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Convert</span>
                </div>

                {/* History */}
                <div onClick={() => changeComponent('history')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
                    <AiOutlineHistory className="text-emerald-500 text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">History</span>
                </div>

                {/* Deposit */}
                <div onClick={() => changeComponent('deposit')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
                    <AiOutlineDollarCircle className="text-emerald-500 text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Deposit</span>
                </div>

                {/* Market Place */}
                <div onClick={() => changeComponent('marketPlace')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
                    <AiOutlineShoppingCart className="text-emerald-500 text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Market Place</span>
                </div>
                 {/* Logout */}
        <div onClick={() => changeComponent('logout')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
          <AiOutlineLogout className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Logout</span>
        </div>
            </nav>
        </div>
    );
};

export default WalletSidebar;
