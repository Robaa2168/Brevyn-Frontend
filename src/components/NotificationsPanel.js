import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa'; // Importing icons
import Lottie from 'lottie-react';
import api from '../api'; 
import loadingAnimation from './lottie/loading.json'; 
import { useUser } from "./context";

const NotificationsPanel = ({ setShowNotifications }) => {
    const { user, login } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch notifications from the server
        const fetchNotifications = async () => {
            try {
                setLoading(true); // Show loading spinner
                const userToken = user?.token; // get the user token from context or state
                const response = await api.get('/api/notifications/unread', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                setNotifications(response.data || []);
                setLoading(false); // Hide loading spinner
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setLoading(false); // Ensure loading is turned off if there is an error
            }
        };
        fetchNotifications();
    }, [user?.token]); 

    const markAsRead = async (notificationId) => {
        try {
            const userToken = user?.token;
            // Optimistically remove the notification from the list
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
    
            // Send the mark as read request to the server
            await api.post(`/api/notifications/mark-read/${notificationId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${userToken}` // Ensure you include the authorization header
                }
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Optionally handle errors, such as rolling back the optimistic update or showing an error message
        }
    };
    

    return (
        <div className="notifications-panel fixed inset-x-0 bottom-0 mb-16 mx-4 p-4 bg-emerald-500 shadow-md rounded-t-md transform transition-transform duration-300 text-white">
            <div className="flex justify-between items-center border-b border-emerald-300 pb-2">
                <h2 className="text-lg px-2">Notifications</h2>
                <button onClick={() => setShowNotifications(false)} className="text-white">
                    <FaTimes />
                </button>
            </div>
            <ul className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <Lottie animationData={loadingAnimation} style={{ width: 100, height: 100 }} />
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map(notification => (
                        <li key={notification._id} className="border-b border-emerald-300 py-2">
                            <div className="flex flex-col justify-between">
                                <span className="text-white">{notification.text}</span>
                                {!notification.isRead && (
                                    <div className="flex justify-end">
                                   <button   className="text-emerald-200 text-xs hover:text-white mt-1" onClick={() => markAsRead(notification._id)}>Mark as Read</button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-white text-center py-4">No notifications</li>
                )}
            </ul>
        </div>
    );
};

export default NotificationsPanel;
