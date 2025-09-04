import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { components } from "../types/api";
import { jwtDecode } from "jwt-decode";

// AuthProvider component to wrap around the app
interface AuthProviderProps {
  children: ReactNode;
}
type UserPublic = components["schemas"]["UserPublic"];
interface JwtPayload {
  exp: number;
  id: string;
  sub: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
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

  const getUserFromToken = (
    token: string | null | undefined
  ): Omit<UserPublic, "created_at" | "role" | "membership"> | undefined => {
    if (!token) return undefined;

    try {
      const userInfo = jwtDecode<JwtPayload>(token);
      return {
        id: userInfo.id,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        username: userInfo.sub,
        avatar_url: userInfo.avatar_url || "",
      };
    } catch (error) {
      console.error("Invalid token:", error);
      return undefined;
    }
  };
  const user = getUserFromToken(token);

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
