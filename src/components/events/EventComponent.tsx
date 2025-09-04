import React, { useState } from "react";
import { components } from "../../types/api";
import { CalendarClock } from "lucide-react";
import { UserList } from "../users";
import { EventEditModal } from "./modals/EventEditModal";
import "./EventComponent.style.css";
import { useAuth } from "../../hooks";

type EventFull = components["schemas"]["EventFull"];
type EventRead = components["schemas"]["EventRead"];

type Props = {
  event: EventFull;
  showActions?: boolean;
  onEdit?: (event: EventRead) => void;
  onDelete?: (eventId: string) => void;
};

// const EventComponent: React.FC<Props> = ({
//   event,
//   showActions,
//   onEdit,
//   onDelete,
// }) => {
//   const { user } = useAuth();
//   const isMyEvent = event.created_by === user?.id;

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const start = new Date(event.start_time);
//   const end = new Date(event.end_time);

//   const dateOptions: Intl.DateTimeFormatOptions = {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   };

//   const timeOptions: Intl.DateTimeFormatOptions = {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   };

//   const startDateStr = start.toLocaleDateString("en-GB", dateOptions);
//   const endDateStr = end.toLocaleDateString("en-GB", dateOptions);
//   const startTimeStr = start.toLocaleTimeString("en-GB", timeOptions);
//   const endTimeStr = end.toLocaleTimeString("en-GB", timeOptions);

//   const isSameDay =
//     start.getFullYear() === end.getFullYear() &&
//     start.getMonth() === end.getMonth() &&
//     start.getDate() === end.getDate();

const EventComponent: React.FC<Props> = ({
  event,
  showActions,
  onEdit,
  onDelete,
}) => {
  // ---- Auth / ownership ----
  const { user } = useAuth();
  const isMyEvent = event.created_by === user?.id;

  // ---- Local state ----
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ---- Date formatting ----
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  // ---- Formatted strings ----
  const startDateStr = start.toLocaleDateString("en-GB", dateOptions);
  const endDateStr = end.toLocaleDateString("en-GB", dateOptions);
  const startTimeStr = start.toLocaleTimeString("en-GB", timeOptions);
  const endTimeStr = end.toLocaleTimeString("en-GB", timeOptions);

  // ---- Check if event is one-day ----
  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  return (
    <div className="event-container">
      <div className="event-header">
        <div className="event-left">
          <div className="event-title-row">
            <CalendarClock className="event-icon" />
            <h3 className="event-title">{event.title}</h3>
          </div>
          <div className="event-members">
            <UserList members={event.members} avatarSize={28} />
          </div>
        </div>

        <div className="event-right">
          <div className="event-meta">
            <span className="event-date">
              {isSameDay ? startDateStr : `${startDateStr} → ${endDateStr}`}
            </span>
            <span className="event-time">
              {startTimeStr} - {endTimeStr}
            </span>
          </div>

          {showActions && (
            <div className="event-actions">
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                }}
                className="event-btn edit"
              >
                {isMyEvent ? "Edit" : "View"}
              </button>
              {isMyEvent && (
                <button
                  onClick={() => onDelete?.(event.id)}
                  className="event-btn delete"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {event.description && (
        <p className="event-description">{event.description}</p>
      )}

      {isEditModalOpen && (
        <EventEditModal
          event={event}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={onEdit ?? (() => {})}
        />
      )}
    </div>
  );
};

export default EventComponent;
