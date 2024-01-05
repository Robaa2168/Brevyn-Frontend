// WalletDashboard.js
import React, { useState, useEffect } from 'react';
import { useUser } from "../context";
import { useNavigate } from 'react-router-dom';
import WalletSidebar from './WalletSidebar';
import Wallet from './Wallet';
import Withdraw from './Withdraw';
import Deposit from './Deposit';
import Convert from './Convert';
import History from './History';
import MarketPlace from './MarketPlace';

const WalletDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('wallet');
  
  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
    }
  }, [user, navigate]);

  const componentMap = {
    wallet: <Wallet />,
    withdraw: <Withdraw />,
    deposit: <Deposit />,
    convert: <Convert />,
    history: <History />,
    marketPlace: <MarketPlace />,
  };

  return (
    <div className="bg-emerald-50 min-h-screen pb-20">
    <div className="lg:flex lg:flex-row p-4 rounded-lg border border-gray-200">
        {/* Sidebar for the Wallet */}
        <WalletSidebar changeComponent={setActiveComponent} />
        {/* Main content area */}
        <div className="mx-4 mt-8  rounded-lg  flex-grow flex flex-col">
          {/* Render the active component */}
          {componentMap[activeComponent] || <p>Component not found</p>}
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
