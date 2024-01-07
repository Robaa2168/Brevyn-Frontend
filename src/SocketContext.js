import React, { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:5000/';
    const socket = io(ENDPOINT);

    useEffect(() => {
        // Establish socket connection on mount
        socket.connect();

        // Disconnect on cleanup
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
