import React from "react";
import { components } from "../../types/api";
import ActionButton from "../common/ActionButton";
import { useInviteRespond } from "../../api/invites";
import { useNotificationRespond } from "../../api/notifications";
import "./NotificationComponent.css";

type Props = {
  notification: components["schemas"]["NotificationRead"];
};

const NotificationComponent: React.FC<Props> = ({ notification }) => {
  const { inviteRespond } = useInviteRespond(notification.object_id);
  const { notificationRespond } = useNotificationRespond(notification.id);

  return (
    <div className="notification-container">
      <div className="notification-top">
        <span className={`notification-type ${notification.object_type}`}>
          {notification.object_type}
        </span>
        <button className="mark-read" onClick={() => notificationRespond(true)}>
          ×
        </button>
      </div>
      <p className="notification-message">{notification.message}</p>
      {notification.object_type === "invitation" && (
        <div className="notification-actions">
          <ActionButton
            typeVariant="accept"
            onClick={() => inviteRespond("accepted")}
          >
            Accept
          </ActionButton>
          <ActionButton
            typeVariant="decline"
            onClick={() => inviteRespond("declined")}
          >
            Decline
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
