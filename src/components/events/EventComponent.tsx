import React from "react";
import { components } from "../../types/api";
import { CalendarClock } from "lucide-react";
import "./EventComponent.style.css";

type Props = {
  event: components["schemas"]["EventRead"];
};

const EventComponent: React.FC<Props> = ({ event }) => {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const startTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(startDate);

  const endTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(endDate);

  const dayLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(startDate);

  return (
    <div className="event-container">
      <div className="event-main">
        <div className="event-header">
          <CalendarClock className="event-icon" />
          <h3 className="event-title">{event.title}</h3>
        </div>

        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
      </div>

      <div className="event-meta">
        <span className="event-date">{dayLabel}</span>
        <span className="event-time">
          {startTime} – {endTime}
        </span>
      </div>
    </div>
  );
};

export default EventComponent;
