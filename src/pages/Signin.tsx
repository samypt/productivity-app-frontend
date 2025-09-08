import { useState, useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import "./Signin.style.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Signin = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Ensure context is not undefined
  if (!authContext) {
    throw new Error(
      "AuthContext is undefined. Please make sure you're using the AuthProvider."
    );
  }

  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(`${BASE_URL}login`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token); // On successful login, store token
        navigate("/dashboard"); // Navigate to a protected route
      } else {
        // Better user feedback if login fails
        toast.error(data.detail || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        "There was an error while logging in. Please try again later."
      );
    }
  };

  return (
    <div className="center-column">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
      <Link to="/singup">Sign Up</Link>
    </div>
  );
};

export default Signin;
