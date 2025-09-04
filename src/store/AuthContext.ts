import { createContext } from "react";
import { components } from "../types/api";

type UserPublic = components["schemas"]["UserPublic"];

// Define the AuthContext type
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  user?: Omit<UserPublic, "created_at" | "role" | "membership">;
}

// Create context with an initial value of `null` and proper typing
export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  user: undefined,
});
