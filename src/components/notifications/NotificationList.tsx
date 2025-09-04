import React, { useEffect, useContext } from "react";
import NotificationComponent from "./NotificationComponent";
import { useInView } from "react-intersection-observer";
import { useFetchNotifications } from "../../api/notifications";
import { AppSyncContext } from "../../store/AppSyncContext";
import "./NotificationList.css";

const NotificationList: React.FC = () => {
  const { version } = useContext(AppSyncContext);

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const {
    notifications,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchNotifications();

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    refetch();
    console.log("Refetching Notifications data...");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return (
    <section className="notifications-section">
      <h2 className="notifications-title">Notifications</h2>

      <div className="notifications-list-container">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p className="no-title">You're all caught up 🎉</p>
            <p className="no-subtitle">
              No unread notifications at the moment.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationComponent
              key={notification.id}
              notification={notification}
            />
          ))
        )}

        <div ref={ref} />
        {isFetchingNextPage && <p className="loading-message">Loading...</p>}
      </div>
    </section>
  );
};

export default NotificationList;
