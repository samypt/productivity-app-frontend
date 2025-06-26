import React from "react";
import { components } from "../../types/api";
import "./NotificationComponent.css";
import ActionButton from "../common/ActionButton";
import { useMutationFetch } from "../../hooks";

type Props = {
  notification: components["schemas"]["NotificationRead"];
};

type InviteStatus = components["schemas"]["InviteStatus"];
type InviteRespond = components["schemas"]["InviteRespond"];
type InviteRead = components["schemas"]["InviteRead"];
type NotificationRespond = components["schemas"]["NotificationRespond"];
type NotificationRead = components["schemas"]["NotificationRead"];

const NotificationComponent: React.FC<Props> = ({ notification }) => {
  const inviteRespond = useMutationFetch<InviteRead, InviteRespond>({
    method: "POST",
    url: `invites/${notification.object_id}/respond`,
    queryKey: "notifications",
  });

  const notificationRespond = useMutationFetch<
    NotificationRead,
    NotificationRespond
  >({
    method: "POST",
    url: `notifications/${notification.id}/respond`,
    queryKey: "notifications",
  });

  const handleInviteRespond = (status: InviteStatus) => {
    inviteRespond.mutate({ status });
  };

  const handleNotificationRespond = () => {
    notificationRespond.mutate({ is_read: true });
  };

  return (
    <div className="notification-container">
      <div className="notification-top">
        <span className={`notification-type ${notification.object_type}`}>
          {notification.object_type}
        </span>
        <button className="mark-read" onClick={handleNotificationRespond}>
          ×
        </button>
      </div>
      <p className="notification-message">{notification.message}</p>
      {notification.object_type === "invitation" && (
        <div className="notification-actions">
          <ActionButton
            typeVariant="accept"
            onClick={() => handleInviteRespond("accepted")}
          >
            Accept
          </ActionButton>
          <ActionButton
            typeVariant="decline"
            onClick={() => handleInviteRespond("declined")}
          >
            Decline
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
