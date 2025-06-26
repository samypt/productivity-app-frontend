import { createContext } from "react";

// Define the AuthContext type
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

// Create context with an initial value of `null` and proper typing
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
