import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Profile from './Profile';
import Dashboard from './dashboard';
import Navbar from './Navbar'; 
import Footer from './Footer'; 
import ProtectedRoute from './ProtectedRoute'; 
import WalletDashboard from './wallet/WalletDashboard';
import PurchasePage from './wallet/PurchasePage';
import Chat from './wallet/Chat';

const AppLayout = () => {
  const location = useLocation();
  const excludedRoutes = ['/login', '/signup', '/KYC', '/verify', '/forgot-password', '/verify_forgot', '/create_password'];

  return (
    <>
      {!excludedRoutes.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/wallet"  element={<ProtectedRoute><WalletDashboard /></ProtectedRoute>} />
        <Route path="/purchase"  element={<ProtectedRoute><PurchasePage /></ProtectedRoute>} />
        <Route path="/chat"  element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
      {!excludedRoutes.includes(location.pathname) && (
          <Footer />
        )}
    </>
  );
};

export default AppLayout;
