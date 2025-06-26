import { useState, useRef } from "react";
import { components } from "../../types/api";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  Settings2,
  SquarePen,
  BadgeInfo,
  Trash2,
  DoorOpen,
} from "lucide-react";
import "./SettingsDropdown.style.css";

type Role = components["schemas"]["Role"];

interface Props {
  onInfoClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  clickOutsideEnabled?: boolean;
  membership?: Role;
}

export const SettingsDropdown: React.FC<Props> = ({
  onInfoClick,
  onEditClick,
  onDeleteClick,
  clickOutsideEnabled,
  membership,
}) => {
  const [open, setOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen(!open);

  useClickOutside({
    ref: settingsRef,
    onClose: () => setOpen(false),
    enabled: clickOutsideEnabled,
  });

  return (
    <div className="settings-container" ref={settingsRef}>
      <Settings2 className="settings-icon" onClick={toggleMenu} />
      {
        <div className={`settings-menu ${open ? "open" : ""}`}>
          <button className="info" onClick={onInfoClick}>
            <BadgeInfo /> Info
          </button>
          <button className="edit" onClick={onEditClick}>
            <SquarePen /> Edit
          </button>
          {membership && (
            <button className="delete" onClick={onDeleteClick}>
              {membership === "owner" ? (
                <>
                  <Trash2 /> Delete
                </>
              ) : (
                <>
                  <DoorOpen /> Leave
                </>
              )}
            </button>
          )}
        </div>
      }
    </div>
  );
};
