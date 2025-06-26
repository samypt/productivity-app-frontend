import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

// AuthProvider component to wrap around the app
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") || null
  );

  // Login function: sets token and stores it in localStorage
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Logout function: removes token and clears localStorage
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // Effect hook to sync token with localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
