import React, { useState, useEffect } from 'react';
import { FaHome, FaDollarSign, FaHandHoldingHeart, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NotificationsPanel from './NotificationsPanel';
import api from '../api';
import { useUser } from './context';

const Footer = () => {
    const { user, login } = useUser();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Function to fetch notification count
        const fetchNotificationCount = async () => {
            try {
                const userToken = user?.token;
                const response = await api.get('/api/notifications/count', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                setNotificationCount(response.data.count);
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        if (user?.token) {
            fetchNotificationCount();
        }
    }, [user]);

    return (
        <div className="footer-container bg-white shadow-md p-4 fixed bottom-0 inset-x-0 mt-10 md:hidden">
            <div className="footer-icons flex justify-around">
                {/* Home Icon */}
                <div className="icon home-icon text-emerald-500" onClick={() => navigate('/home')}>
                    <FaHome size={20} />
                </div>

                {/* Dollar Icon */}
                <div className="icon wallet-icon text-emerald-500" onClick={() => navigate('/wallet')}>
                    <FaDollarSign size={20} />
                </div>

                {/* Hand Holding Heart Icon */}
                <div className="icon volunteer-icon text-emerald-500" onClick={() => navigate('/donations')}>
                    <FaHandHoldingHeart size={20} />
                </div>

                {/* Notification Bell Icon */}
                <div
                    className="relative icon notification-icon text-emerald-500"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <FaBell size={24} />
                    {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {notificationCount}
                        </span>
                    )}
                </div>
            </div>
            {/* Conditionally render the Notifications Panel */}
            {showNotifications && <NotificationsPanel setShowNotifications={setShowNotifications} />}
        </div>
    );
};

export default Footer;
