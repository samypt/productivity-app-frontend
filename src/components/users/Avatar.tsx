import React from "react";
import { components } from "../../types/api";
import "./Avatar.css";

const avatarColors = [
  "#E0F2FE",
  "#FEF9C3",
  "#DCFCE7",
  "#FDE68A",
  "#F3E8FF",
  "#FCE7F3",
  "#E2E8F0",
  "#FFE4E6",
  "#DDD6FE",
  "#BAE6FD",
  "#C7D2FE",
  "#BBF7D0",
  "#F0ABFC",
  "#FDBA74",
  "#F1F5F9",
];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

const getInitials = (
  firstName?: string,
  lastName?: string,
  initial?: string
): string => {
  const first = (firstName ?? "").trim();
  const last = (lastName ?? "").trim();
  const firstInitial = first ? first[0].toUpperCase() : "";
  const lastInitial = last ? last[0].toUpperCase() : "";
  return initial || firstInitial + lastInitial || "?";
};

const getContrastTextColor = (bgColor: string): string => {
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1F2937" : "#ffffff";
};
type UserPublic = components["schemas"]["UserPublic"];

type AvatarProps = {
  // user?: UserPublic | Omit<UserPublic, "created_at" | "role" | "membership">;
  user?: UserPublic;
  initial?: string;
  size?: number;
  zIndex?: number;
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({
  user,
  initial,
  size = 32,
  zIndex = 1,
  className = "",
}) => {
  const name = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`;
  const bgColor = getAvatarColor(user?.username || "");
  const textColor = getContrastTextColor(bgColor);
  const initials = getInitials(user?.first_name, user?.last_name, initial);

  return user?.avatar_url ? (
    <img
      src={`https://127.0.0.1:8000${user.avatar_url}?v=${user.updated_at}`}
      alt={name.trim() || "Avatar"}
      className={`avatar ${className}`}
      style={{ width: size, height: size, zIndex }}
    />
  ) : (
    <div
      className={`avatar ${className}`}
      title={name.trim()}
      style={{
        backgroundColor: className ? undefined : bgColor,
        color: className ? undefined : textColor,
        width: size,
        height: size,
        zIndex,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
};
