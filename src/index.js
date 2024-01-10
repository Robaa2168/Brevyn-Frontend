// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './SocketContext'; // Import the SocketProvider

// Unregister service workers before your application is rendered
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider> {/* Wrap App with SocketProvider */}
      <App />
    </SocketProvider>
  </React.StrictMode>
);

reportWebVitals();
