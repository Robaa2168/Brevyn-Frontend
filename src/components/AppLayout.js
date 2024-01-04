import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import Donations from './Donations';
import DonationsPreviewPage from './DonationsPreviewPage';
import EditDonationLink from './EditDonationLink';
import CreateImpact from './CreateImpact';

const AppLayout = () => {
  const location = useLocation();
  const excludedRoutes = ['/login', '/signup', '/KYC', '/donate/*', '/forgot-password', '/verification', '/reset-password', '/verify'];
  const dynamicRoutesToExclude = ['/donate', '/donation-link'];

  const isExcludedRoute = excludedRoutes.includes(location.pathname) ||
  dynamicRoutesToExclude.some(route => location.pathname.startsWith(route));


  return (
    <>
      {!isExcludedRoute && <Navbar />}
      
      <Routes>
        <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
        <Route path="/chat/:tradeId"  element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/donate/:uniqueIdentifier" element={<Donations />} />
        <Route path="/donation-link/:id"  element={<ProtectedRoute><DonationsPreviewPage /></ProtectedRoute>} />
        <Route path="/link/edit/:id"  element={<ProtectedRoute><EditDonationLink /></ProtectedRoute>} />
        <Route path="/CreateImpact"  element={<ProtectedRoute><CreateImpact /></ProtectedRoute>} />
      </Routes>
      {!isExcludedRoute && <Footer />}
    </>
  );
};

export default AppLayout;
