import React from 'react';
import './App.css';
import { UserProvider } from "./components/context";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from './components/AppLayout'; 
import { SocketProvider } from './SocketContext';

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;
