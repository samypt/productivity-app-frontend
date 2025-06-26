import React, { useEffect, useContext } from "react";
import { components } from "../../types/api";
import NotificationComponent from "./NotificationComponent";
import { useFetch } from "../../hooks";
import { AppSyncContext } from "../../store/AppSyncContext";
import "./NotificationList.css";

type NotificationList = components["schemas"]["NotificationList"];

const NotificationList: React.FC = () => {
  const { version } = useContext(AppSyncContext);

  const { data, refetch } = useFetch<NotificationList>({
    url: "notifications",
    queryKey: "notifications",
  });

  useEffect(() => {
    refetch();
    console.log("Refetching Notifications data...");
  }, [version]);

  const unreadNotifications =
    data?.notifications.filter((n) => !n.is_read) ?? [];
  // data?.notifications.filter((n) => !n.is_read) ?? [];

  return (
    <div className="notifications-list-container">
      <h2 className="notifications-title">Notifications</h2>
      {unreadNotifications.length === 0 ? (
        <div className="no-notifications">You're all caught up 🎉</div>
      ) : (
        unreadNotifications.map((notification) => (
          <NotificationComponent
            key={notification.id}
            notification={notification}
          />
        ))
      )}
    </div>
  );
};

export default NotificationList;
