import { useContext, useState } from "react";
import { AuthContext } from "../store/AuthContext";
import { AvatarUploader } from "../components/users";
import { useLoadUserData } from "../api/users";
import "./UserSettingsPage.style.css";

export default function UserSettingsPage() {
  const { user } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");

  const { data } = useLoadUserData();

  const userData = { ...user, ...data };

  const [notifications, setNotifications] = useState({
    taskUpdates: true,
    newTeamMember: true,
    newFeatures: false,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update name:", { firstName, lastName });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Change password");
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>User Settings</h1>
        <p>Manage your personal information and preferences.</p>
      </header>

      {user && (
        <>
          {/* 👤 Account Info */}
          <section className="settings-section">
            <h2>Account Information</h2>
            <div className="avatar-wrapper">
              <AvatarUploader user={userData} />
              {/* <Avatar user={user} size={120} /> */}
            </div>
            <p className="user-email">{user.email}</p>
            <form className="form" onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn primary">
                Save Changes
              </button>
            </form>
          </section>

          <section className="settings-section">
            <h2>Change Password</h2>
            <form className="form" onSubmit={handlePasswordChange}>
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={user.email}
                style={{ display: "none" }}
                readOnly
              />
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Current password"
                  autoComplete="current-password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="btn secondary">
                Change Password
              </button>
            </form>
          </section>

          <section className="settings-section">
            <h2>Notifications</h2>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={notifications.taskUpdates}
                  onChange={() => handleNotificationToggle("taskUpdates")}
                />
                Email me about task updates
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={notifications.newTeamMember}
                  onChange={() => handleNotificationToggle("newTeamMember")}
                />
                Notify me when someone joins my team
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={notifications.newFeatures}
                  onChange={() => handleNotificationToggle("newFeatures")}
                />
                Notify me about new features
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h2>Data & Privacy</h2>
            <div className="form-actions">
              <button className="btn">Export My Data</button>
              <button className="btn danger">Delete My Account</button>
            </div>
          </section>

          <section className="settings-section">
            <h2>Google Calendar Sync</h2>
            <p>Status: Connected as {user.email}</p>
            <button className="btn secondary">Reconnect / Manage</button>
          </section>
        </>
      )}
    </div>
  );
}
