// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineDashboard,AiOutlineWallet, AiOutlineGift, AiOutlineTeam,AiOutlineIdcard, AiOutlineUser, AiOutlineLock, AiOutlineLogout } from 'react-icons/ai';

const Sidebar = ({ changeComponent }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mx-4 lg:mx-8 lg:rounded-none lg:h-full lg:w-64 mt-4 md:mt-8 lg:mt-16">
      <nav className="flex flex-col space-y-3">
        {/* Dashboard */}
        <div onClick={() => changeComponent('donationsSummary')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
          <AiOutlineDashboard className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Dashboard</span>
        </div>
       {/* Wallet */}
       <Link to="/wallet" className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-emerald-500 transition-colors">
                    <AiOutlineWallet className="text-emerald-500 text-xl sm:text-2xl" />
                    <span className="text-xs sm:text-sm">Wallet</span>
                </Link>
        {/* My Donations */}
        <div onClick={() => changeComponent('myDonations')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
          <AiOutlineGift className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Donations</span>
        </div>

        {/* Volunteer Activities */}
        <div onClick={() => changeComponent('volunteerActivities')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
          <AiOutlineTeam className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Volunteer Activities</span>
        </div>
        {/* Membership */}
        <div onClick={() => changeComponent('membership')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
          <AiOutlineIdcard className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Membership</span>
        </div>

        {/* Update Profile */}
        <div onClick={() => changeComponent('profile')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
          <AiOutlineUser className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Profile</span>
        </div>

        {/* Change Password */}
        <div onClick={() => changeComponent('changePassword')} className="flex items-center space-x-3 text-gray-700 cursor-pointer">
          <AiOutlineLock className="text-emerald-500 text-xl sm:text-2xl" />
          <span className="text-xs sm:text-sm">Change Password</span>
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

export default Sidebar;
