import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isTokenValid } from "../../utils/auth";
import {
  LogOut,
  LogIn,
  CircleUser,
  Settings,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Avatar } from "../users";
import { useAuth, useClickOutside } from "../../hooks";
import { useLoadUserData } from "../../api/users";
import { useTheme, Theme } from "../../hooks/useTheme";
import "./Topbar.style.css";

export default function Topbar() {
  const { token, logout, user } = useAuth();
  const { data } = useLoadUserData();
  const userData = { ...user, ...data };

  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  useClickOutside({
    ref: dropdownRef,
    onClose: () => setMenuOpen(false),
    enabled: true,
  });

  const ThemeIcon = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
    system: <Monitor size={18} />,
  };

  return (
    <nav className="topbar">
      <div className="topbar-left">
        <span className="app-logo">Teamly</span>
      </div>

      <div className="topbar-right">
        {isTokenValid(token) && (
          <div className="theme-toggle-group">
            {Object.entries(ThemeIcon).map(([key, icon]) => (
              <button
                key={key}
                className={`theme-toggle-button ${
                  theme === key ? "active" : ""
                }`}
                onClick={() => setTheme(key as Theme)}
                title={`Theme: ${key}`}
              >
                {icon}
              </button>
            ))}
          </div>
        )}

        {isTokenValid(token) ? (
          <div className="topbar-user" ref={dropdownRef}>
            <button
              className="topbar-icon"
              onClick={() => setMenuOpen((prev) => !prev)}
              title="Account"
            >
              <CircleUser />
            </button>

            {menuOpen && (
              <div className="dropdown-menu" role="menu" aria-label="User menu">
                <div className="dropdown-header">
                  <Avatar user={userData} size={80} />
                  <strong>
                    {userData.first_name} {userData.last_name}
                  </strong>
                  <p className="user-email">{userData.email}</p>
                </div>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/settings");
                    setMenuOpen(false);
                  }}
                  role="menuitem"
                >
                  <Settings size={16} /> Settings
                </button>

                <button
                  className="dropdown-item logout"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="topbar-icon" title="Login">
            <LogIn />
          </Link>
        )}
      </div>
    </nav>
  );
}
