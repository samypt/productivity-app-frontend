// import { useAuth } from "../context/AuthContext"; // if you have it
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";
import { isTokenValid } from "../../utils/auth";
import { LogOut, LogIn, CircleUser } from "lucide-react";
import "./Topbar.style.css";

export default function Topbar() {
  const { token, logout } = useContext(AuthContext);
  const validToken: boolean = token && isTokenValid(token);

  return (
    <nav className="topbar">
      <div className="topbar-left">
        <span className="app-logo">Teamly</span>
      </div>
      <div className="topbar-right">
        {validToken ? (
          <>
            <Link to="/dashboard" className="topbar-icon" title="Dashboard">
              <CircleUser />
            </Link>
            <Link
              to="/"
              onClick={logout}
              className="topbar-icon"
              title="Logout"
            >
              <LogOut />
            </Link>
          </>
        ) : (
          <Link to="/login" className="topbar-icon" title="Login">
            <LogIn />
          </Link>
        )}
      </div>
    </nav>
  );
}
