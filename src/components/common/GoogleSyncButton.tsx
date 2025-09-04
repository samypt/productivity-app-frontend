import { CalendarSync } from "lucide-react";

const GOOGLE_CLIENT_ID =
  "913527112628-p7kr2hsi9l0q82s10uqc2i1g0om66rau.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173/google/callback";

const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=email profile&prompt=select_account`;

export const GoogleSyncButton = () => {
  const handleClick = () => {
    window.location.href = GOOGLE_AUTH_URL;
    console.log("Redirecting to Google OAuth");
  };

  return (
    <button className="google-calendar-btn" onClick={() => handleClick()}>
      Sync with Google Calendar {<CalendarSync />}
    </button>
  );
};
