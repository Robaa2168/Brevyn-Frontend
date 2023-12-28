//dashboard.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChangePassword  from './ChangePassword';
import DonationsSummary from './DonationsSummary';
import MyDonations from './MyDonations'; 
import VolunteerActivities from './VolunteerActivities'; 
import Profile from './Profile';
import Membership from './Membership';
import Wallet from './wallet/Wallet';
import Kyc from './Kyc';


const Dashboard = () => {
  // State to manage which component is displayed
  const [activeComponent, setActiveComponent] = useState('donationsSummary');

  // Object to map component keys to component render functions
  const componentMap = {
    donationsSummary: <DonationsSummary setActiveComponent={setActiveComponent} />,
    myDonations: <MyDonations />,
    volunteerActivities:<VolunteerActivities />,
    changePassword:<ChangePassword  />,
    profile:<Profile />,
    membership:<Membership />,
    wallet:<Wallet />,
    kyc:<Kyc />,
  };

  return (
    <div className="bg-emerald-50 min-h-screen pb-20"> 
      <div className="lg:flex lg:flex-row p-4 rounded-lg border border-gray-200">
        <Sidebar changeComponent={setActiveComponent} />
        {/* Main content */}
        <div className="mx-4 mt-8 p-4 rounded-lg border border-gray-200 flex-grow flex flex-col">
          {/* Render the active component */}
          {componentMap[activeComponent]}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
