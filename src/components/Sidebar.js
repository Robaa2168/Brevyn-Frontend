// Sidebar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineWallet,
  AiOutlineGift,
  AiOutlineTeam,
  AiOutlineIdcard,
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineLogout,
} from 'react-icons/ai';
import { useUser } from './context'; // Adjust the path as necessary

const Sidebar = ({ changeComponent }) => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('donationsSummary'); // Initialize the active component state

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClick = (componentName) => {
    setActiveComponent(componentName); // Update the active component state
    changeComponent(componentName);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mx-4 lg:mx-8 lg:rounded-none lg:h-full lg:w-64 mt-4 md:mt-8 lg:mt-16">
      <nav className="flex flex-col space-y-3">
        {/* Dashboard */}
        <div
          onClick={() => handleClick('donationsSummary')}
          className={`flex items-center space-x-3 cursor-pointer ${
            activeComponent === 'donationsSummary'
              ? 'p-2 rounded-md text-emerald-700 bg-emerald-100'
              : 'text-gray-700'
          }`}
        >
          <AiOutlineDashboard className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Dashboard</span>
        </div>
        {/* Wallet */}
        <Link
          to="/wallet"
          onClick={() => handleClick('wallet')}
          className={`flex items-center space-x-3 cursor-pointer ${
            activeComponent === 'wallet' ? 'text-emerald-500' : 'text-gray-700'
          }`}
        >
          <AiOutlineWallet className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Wallet</span>
        </Link>
        {/* My Donations */}
        <div
          onClick={() => handleClick('myDonations')}
          className={`flex items-center space-x-3 cursor-pointer ${
            activeComponent === 'myDonations' ? 'text-emerald-500' : 'text-gray-700'
          }`}
        >
          <AiOutlineGift className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Donations</span>
        </div>
        {/* Volunteer Activities */}
        <div
          onClick={() => handleClick('volunteerActivities')}
          className={`flex items-center space-x-3 cursor-pointer ${
            activeComponent === 'volunteerActivities' ? 'text-emerald-500' : 'text-gray-700'
          }`}
        >
          <AiOutlineTeam className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Volunteer Activities</span>
        </div>
        {/* Membership */}
        <div
          onClick={() => handleClick('membership')}
          className={`flex items-center space-x-3 cursor-pointer ${
            activeComponent === 'membership' ? 'text-emerald-500' : 'text-gray-700'
          }`}
        >
          <AiOutlineIdcard className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Membership</span>
        </div>
        {/* Update Profile */}
        <div
          onClick={() => handleClick('profile')}
          className={`flex items-center space-x-3 cursor-pointer ${
            activeComponent === 'profile' ? 'text-emerald-500' : 'text-gray-700'
          }`}
        >
          <AiOutlineUser className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Profile</span>
        </div>
        {/* Change Password */}
        <div
          onClick={() => handleClick('changePassword')}
          className={`flex items-center space-x-3 cursor-pointer ${
            activeComponent === 'changePassword' ? 'text-emerald-500' : 'text-gray-700'
          }`}
        >
          <AiOutlineLock className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Change Password</span>
        </div>
        {/* Logout */}
        <div onClick={handleLogout} className="flex items-center space-x-3 cursor-pointer">
          <AiOutlineLogout className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Logout</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
