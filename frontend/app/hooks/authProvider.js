import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/authService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch (error) {
      console.error("Failed to load current user:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
