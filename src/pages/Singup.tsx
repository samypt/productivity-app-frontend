import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import "./Signin.style.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { inviteToken } = useParams();
  const navigate = useNavigate();

  const signUpLink = inviteToken
    ? `${BASE_URL}signup/${inviteToken}`
    : `${BASE_URL}signup`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(signUpLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          username: username,
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`We sent a confirmation email to ${data.email}`);
        navigate("/login"); // Navigate to a protected route
      } else {
        // Better user feedback if login fails
        toast.error(data.detail || "SignUp failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signup in:", error);
      alert("There was an error. Please try again later.");
    }
  };

  return (
    <div className="center-column">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>SignUp</h2>

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
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={firstName}
            autoComplete="given-name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={lastName}
            autoComplete="family-name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">New password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Confirm password:</label>
          <input
            id="confirmPassword"
            type="password"
            name="password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
