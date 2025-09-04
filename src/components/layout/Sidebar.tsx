import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";
import { isTokenValid } from "../../utils/auth";
import { Users, LayoutDashboard, Calendar1 } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { AppSyncContext } from "../../store/AppSyncContext";
import { useLocation } from "react-router-dom";
import "./Sidebar.style.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/teams", label: "Teams", Icon: Users },
  { to: "/calendar", label: "Calendar", Icon: Calendar1 },
];

const Sidebar = () => {
  const { token } = useContext(AuthContext);
  const validToken = !!token && isTokenValid(token);

  const socketRef = useWebSocket(token!);
  const dashboardNotifications = socketRef.messages.count;

  const location = useLocation();
  const { triggerUpdate } = useContext(AppSyncContext);

  useEffect(() => {
    if (socketRef && location.pathname === "/dashboard") {
      triggerUpdate();
    }
  }, [socketRef.messages, location.pathname, triggerUpdate]);

  return (
    <nav className="sidebar" aria-label="Primary Navigation">
      <div className="sidebar-links">
        {validToken &&
          navItems.map(({ to, label, Icon }) => {
            const isActive =
              to === "/dashboard"
                ? location.pathname === to
                : location.pathname.startsWith(to);
            return (
              <Link
                to={to}
                key={to}
                className={`icon-link ${isActive ? "active" : ""}`}
                aria-label={label}
              >
                <Icon />
                <span className="link-label">{label}</span>
                {to === "/dashboard" && dashboardNotifications > 0 && (
                  <span className="notification-badge" aria-live="polite">
                    {dashboardNotifications}
                  </span>
                )}
              </Link>
            );
          })}
      </div>
    </nav>
  );
};

export default Sidebar;
