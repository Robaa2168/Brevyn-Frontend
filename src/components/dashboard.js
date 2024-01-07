//dashboard.js
import React, { useState, useEffect } from 'react';
import { useUser } from "./context";
import { useNavigate } from 'react-router-dom';
import api from '../api';
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
  const navigate = useNavigate();
  const { user, login } = useUser();
  // State to manage which component is displayed
  const [activeComponent, setActiveComponent] = useState('donationsSummary');

  useEffect(() => {
    // Redirect to login if no user token exists
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
            login({ ...user, ...response.data }); // Spread and update
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
        <div className="mx-4 mt-8  rounded-lg border border-gray-200 flex-grow flex flex-col">
          {/* Render the active component */}
          {componentMap[activeComponent]}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
