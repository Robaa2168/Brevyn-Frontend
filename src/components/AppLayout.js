import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useUser } from "./context";
import Login from './auth/Login';
import Home from './Home';
import Signup from './auth/Signup';
import VerificationPage from './auth/VerificationPage';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Verify from './auth/Verify';
import Profile from './Profile';
import Dashboard from './dashboard';
import Navbar from './Navbar'; 
import Footer from './Footer'; 
import ProtectedRoute from './ProtectedRoute'; 
import WalletDashboard from './wallet/WalletDashboard';
import PurchasePage from './wallet/PurchasePage';
import Chat from './wallet/Chat';
import SellerPortal from './wallet/SellerPortal';
import SellerHistory from './wallet/SellerHistory';
import Donations from './Donations';
import DonationsPreviewPage from './DonationsPreviewPage';
import EditDonationLink from './EditDonationLink';
import CreateImpact from './CreateImpact';
import ImpactDetail from './ImpactDetail';

const AppLayout = () => {
  const { user } = useUser();
  const location = useLocation();
  const excludedRoutes = ['/login', '/signup', '/KYC', '/donate/*', '/forgot-password', '/verification', '/reset-password', '/verify'];
  const dynamicRoutesToExclude = ['/donate', '/donation-link'];

  const isExcludedRoute = excludedRoutes.includes(location.pathname) ||
  dynamicRoutesToExclude.some(route => location.pathname.startsWith(route));

   // This useEffect runs once when the component mounts and sets up the Tawk script
useEffect(() => {
  if (window.Tawk_API) {
    return;  // Exit if Tawk is already initialized
  }
  
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.onLoad = setTawkAttributes;
  
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/62d82c8a54f06e12d88a7aaf/1hjfc4ecq';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
  document.body.appendChild(s1);
  
  return () => {
    document.body.removeChild(s1);
    if (window.Tawk_API) {
      delete window.Tawk_API.onLoad;
    }
  };
}, []); 

// This useEffect runs every time the user object changes. It sets the attributes on Tawk.
useEffect(() => {
  setTawkAttributes();
}, [user]);

function setTawkAttributes() {
  if (user?.primaryInfo?.firstName && user?.primaryInfo?.lastName && window.Tawk_API) {
    try {
      window.Tawk_API.setAttributes({
        'name': `${user.primaryInfo.firstName} ${user.primaryInfo.lastName}`,
        'email' : `${user.primaryInfo.email}`,
        'phoneNumber' : `${user?.primaryInfo?.phoneNumber}`,
        'payID':  `${user?.primaryInfo?.payID}`,
      }, false);
    } catch (error) {
      console.error('Error setting Tawk attributes:', error);
    }
  }
}




  return (
    <>
      {!isExcludedRoute && <Navbar />}
      
      <Routes>
      <Route path="*" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/wallet"  element={<ProtectedRoute><WalletDashboard /></ProtectedRoute>} />
        <Route path="/purchase"  element={<ProtectedRoute><PurchasePage /></ProtectedRoute>} />
        <Route path="/sellerTrades"  element={<ProtectedRoute><SellerHistory /></ProtectedRoute>} />
        <Route path="/chat/:tradeId"  element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/portal/:tradeId"  element={<ProtectedRoute><SellerPortal /></ProtectedRoute>} />
        <Route path="/donate/:uniqueIdentifier" element={<Donations />} />
        <Route path="/donation-link/:id"  element={<ProtectedRoute><DonationsPreviewPage /></ProtectedRoute>} />
        <Route path="/link/edit/:id"  element={<ProtectedRoute><EditDonationLink /></ProtectedRoute>} />
        <Route path="/CreateImpact"  element={<ProtectedRoute><CreateImpact /></ProtectedRoute>} />
        <Route path="/impact/:id"  element={<ImpactDetail />} />
      </Routes>
      {!isExcludedRoute && <Footer />}
    </>
  );
};

export default AppLayout;
