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
import PhoneVerify from './auth/PhoneVerify';
import ChangeNumber from './auth/changeNumber';
import Profile from './Profile';
import Dashboard from './dashboard';
import Navbar from './Navbar'; 
import Footer from './Footer'; 
import ProtectedRoute from './ProtectedRoute'; 
import WalletDashboard from './wallet/WalletDashboard';
import TransferBonusDash from './wallet/transactions/TransferBonusDash';
import PurchasePage from './wallet/PurchasePage';
import Chat from './wallet/Chat';
import SellerPortal from './wallet/SellerPortal';
import SellerHistory from './wallet/SellerHistory';
import Donations from './Donations';
import DonationsPreviewPage from './DonationsPreviewPage';
import EditDonationLink from './EditDonationLink';
import CreateImpact from './CreateImpact';
import ImpactDetail from './ImpactDetail';
import AdminPanelContainer from './Admin/AdminPanelContainer';
import ReviewList from './Admin/Reviews/ReviewList';
import UserDetails  from './Admin/customers/UserDetails';
import PendingWithdrawals  from './Admin/customers/PendingWithdrawals';
import UserEdit  from './Admin/customers/UserEdit';
import KYCEdit  from './Admin/customers/KYCEdit';
import EditReview from './Admin/Reviews/EditReview';
import PostReview from './Admin/Reviews/PostReview';
import HelpPage from './Help/Help';
import AdminHelpPage from './Help/AdminHelpPage';
import EditFaq from './Help/EditFaq';
import PostFaq from './Help/PostFaq';
import AboutUsPage from './Help/AboutUs';

const AppLayout = () => {
  const { user } = useUser();
  const location = useLocation();
  const excludedRoutes = ['/login', '/signup', '/KYC', '/donate/*', '/forgot-password', '/verification', '/reset-password', '/verify', '/phone-verify', '/changeNumber'];
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
        'payID':  `${user?.payId}`,
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
        <Route path="/phone-verify" element={<PhoneVerify />} />
        <Route path="/changeNumber" element={<ChangeNumber />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/hamerling"  element={<ProtectedRoute><AdminPanelContainer /></ProtectedRoute>} />
        <Route path="/user-details/:userId"  element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
        <Route path="/pending-withdrawals"  element={<ProtectedRoute><PendingWithdrawals /></ProtectedRoute>} />
        <Route path="/user-edit/:userId"  element={<ProtectedRoute><UserEdit /></ProtectedRoute>} />
        <Route path="/kyc-edit/:userId"  element={<ProtectedRoute><KYCEdit /></ProtectedRoute>} />
        <Route path="/brookebo"  element={<ProtectedRoute><TransferBonusDash /></ProtectedRoute>} />
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
        <Route path="/ReviewList"  element={<ProtectedRoute><ReviewList /></ProtectedRoute>} />
        <Route path="/edit-review/:reviewId"  element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
        <Route path="/post-review"  element={<ProtectedRoute><PostReview /></ProtectedRoute>} />
        <Route path="/help"  element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
        <Route path="/Adminhelp"  element={<ProtectedRoute><AdminHelpPage  /></ProtectedRoute>} />
        <Route path="/edit-faq/:faqId"  element={<ProtectedRoute><EditFaq /></ProtectedRoute>} />
        <Route path="/post-faq"  element={<ProtectedRoute><PostFaq /></ProtectedRoute>} />
        <Route path="/about"  element={<AboutUsPage />} />
      </Routes>
      {!isExcludedRoute && <Footer />}
    </>
  );
};

export default AppLayout;
