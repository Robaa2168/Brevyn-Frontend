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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      {!excludedRoutes.includes(location.pathname) && (
          <Footer />
        )}
    </>
  );
};

export default AppLayout;
