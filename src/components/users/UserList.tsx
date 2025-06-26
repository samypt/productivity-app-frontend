import React from "react";
import { Avatar } from "./index";
import { components } from "../../types/api";
import "./UserList.style.css";

type Props = {
  avatarLength?: number;
  avatarSize?: number;
  members: components["schemas"]["UserPublic"][];
};

export const UserList: React.FC<Props> = ({
  avatarLength = 5,
  avatarSize = 24,
  members,
}) => {
  return (
    <div className="team-members interactive">
      {members.slice(0, avatarLength).map((member, index) => {
        return (
          <Avatar
            key={index}
            user={member}
            zIndex={members.length - index}
            size={avatarSize}
          />
        );
      })}
      {members.length > avatarLength && (
        <Avatar
          key={avatarLength + 1}
          initial={`+${members.length - avatarLength}`}
          size={avatarSize}
          className="more"
        />
      )}
    </div>
  );
};
