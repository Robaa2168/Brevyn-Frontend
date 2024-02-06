import React, { useState, useEffect } from 'react';
import { useUser } from "../context";
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import api from '../../api';
import WalletSidebar from './WalletSidebar';
import Wallet from './Wallet';
import ConversionContainer from './conversion/ConversionContainer';
import Withdraw from './withdrawal/Withdraw';
import CurrenciesContainer from './CurrenciesContainer';
import DepositContainer from './deposits/DepositContainer';
import TransferContainer from './transactions/TransferContainer';
import WithdrawalHistory from './history/WithdrawalHistory';
import HistoryContainer from './history/HistoryContainer';
import MarketPlace from './MarketPlace';
import Kyc from '../Kyc';

const WalletDashboard = () => {
  const { user, login } = useUser();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('wallet');


  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
    } else {
      // Fetch updated user data when dashboard is visited
      const fetchUserData = async () => {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          };
          const response = await api.get('/api/auth/info', config);
          if (response.status === 200) {
            // Update context by spreading the existing user and overriding with new data
            login({ ...user, ...response.data });
          } else {
            console.error('Failed to fetch user data, status code:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    // This useEffect is specifically for setting the active component based on user's primary info
    if (!user?.primaryInfo?.firstName || !user?.primaryInfo?.lastName) {
      setActiveComponent('kyc');
    }
  }, [user]);

  const componentMap = {
    wallet: <Wallet />,
    CurrenciesContainer: <CurrenciesContainer />,
    ConversionContainer: <ConversionContainer setActiveComponent={setActiveComponent} />,
    withdraw: <Withdraw />,
    DepositContainer: <DepositContainer setActiveComponent={setActiveComponent} />,
    TransferContainer: <TransferContainer setActiveComponent={setActiveComponent} />,
    WithdrawalHistory: <WithdrawalHistory />,
    HistoryContainer: <HistoryContainer />,
    marketPlace: <MarketPlace />,
    kyc: <Kyc />,
  };

  return (
    <div className="bg-emerald-50 min-h-screen pb-20">
{user?.isBanned && (
    <div className="bg-red-200 text-red-700 p-3 flex flex-row items-center justify-start sm:justify-center">
      <FaExclamationTriangle className="mr-2 text-4xl sm:text-xl" />
      <span className="text-xs sm:text-sm">
        Your account is temporarily banned. Please check your email for instructions on how to provide the required documents.
      </span>
    </div>
)}




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
