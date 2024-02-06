
// components/context.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenValid } from "../jwtHelper";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (isTokenValid(parsedUser.token)) {
        return parsedUser;
      } else {
        localStorage.removeItem("user");
      }
    }
    return null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const checkTokenExpiry = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (!isTokenValid(parsedUser.token)) {
        logout();
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [user]); // Re-run the effect if the user state changes

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ... (Other parts of your file, including exports and imports)
