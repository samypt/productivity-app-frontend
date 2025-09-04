import { useEffect, useState } from "react";
import { useSendAccessTokenToBackend } from "../api/google-sync";

export const GoogleCallback = () => {
  const [subscribeUrl, setSubscribeUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendAccessTokenToBackend = useSendAccessTokenToBackend();

  useEffect(() => {
    const accessToken = new URLSearchParams(
      window.location.hash.substring(1)
    ).get("access_token");
    console.log("Access Token:", accessToken);

    if (accessToken) {
      sendAccessTokenToBackend.mutate(
        { accessToken },
        {
          onSuccess: (data) => {
            console.log("Connected!", data);
            setMessage(data.message);
            setSubscribeUrl(data.subscribeUrl);
          },
          onError: (err: any) => {
            console.error("Sync failed", err);
            setError("Calendar sync failed. Please try again.");
          },
        }
      );
    } else {
      setError("No access token found in URL.");
    }
  }, []);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && subscribeUrl ? (
        <p>
          ✅ {message}
          <br />
          👉{" "}
          <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
            Click here to view it in Google Calendar
          </a>
        </p>
      ) : (
        !error && <p>Connecting to your Google Calendar...</p>
      )}
    </div>
  );
};
