import React, { useState } from "react";
import EventComponent from "./EventComponent";
import { components } from "../../types/api";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAgendaEvents } from "../../api/events";
import "./Agenda.style.css";
import { endOfWeek, startOfWeek } from "date-fns";
import { formatWeekRange, isDayInRange, isInWeek } from "../../utils";

type EventCreate = components["schemas"]["EventCreate"];

interface Project {
  projectID?: string;
  showActions?: boolean;
}

type ViewType = "day" | "week";

const Agenda: React.FC<Project> = ({ projectID, showActions }) => {
  // -------------------------------
  // View & navigation state
  // -------------------------------
  const [view, setView] = useState<ViewType>("day");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [startDate, setStartDate] = useState(() => {
    const start = startOfWeek(new Date());
    return new Date(start.setHours(0, 0, 0, 0));
  });

  const [endDate, setEndDate] = useState(() => {
    const end = endOfWeek(new Date());
    return new Date(end.setHours(0, 0, 0, 0));
  });

  // -------------------------------
  // API hooks (Events CRUD)
  // -------------------------------

  const { data, error, isLoading, deleteEvent, updateEvent, createEvent } =
    useAgendaEvents(projectID, startDate, endDate);

  // -------------------------------
  // Navigation handlers
  // -------------------------------
  const handlePrev = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (view === "day" ? -1 : -7)
    );
    setCurrentDate(newDate);
    setStartDate(startOfWeek(newDate));
    setEndDate(endOfWeek(newDate));
  };

  const handleNext = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (view === "day" ? 1 : 7)
    );
    setCurrentDate(newDate);
    setStartDate(startOfWeek(newDate));
    setEndDate(endOfWeek(newDate));
    console.log("not my function", startOfWeek(newDate));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setStartDate(startOfWeek(new Date()));
    setEndDate(endOfWeek(new Date()));
  };

  // -------------------------------
  // Derived: filtered events
  // -------------------------------
  const filteredEvents =
    data?.events?.filter((event) => {
      const eventStartDate = new Date(event.start_time);
      const eventEndDate = new Date(event.end_time);
      return view === "day"
        ? isDayInRange(eventStartDate, eventEndDate, currentDate)
        : isInWeek(eventStartDate, eventEndDate, currentDate);
    }) || [];

  // -------------------------------
  // Add Event form state & handlers
  // -------------------------------
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("Please enter a title.");
    if (!newStart || !newEnd)
      return alert("Please select start and end date/time.");
    if (new Date(newStart) >= new Date(newEnd))
      return alert("Start time must be before to end time.");

    const newEvent: EventCreate = {
      title: newTitle,
      start_time: newStart,
      end_time: newEnd,
      description: "",
      project_id: projectID || "",
    };

    createEvent(newEvent);

    setNewTitle("");
    setNewStart("");
    setNewEnd("");
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setNewTitle("");
    setNewStart("");
    setNewEnd("");
  };

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <h2>Agenda</h2>
        <div className="event-nav">
          <button onClick={handlePrev} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <span className="date-label">
            {view === "day"
              ? currentDate.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })
              : formatWeekRange(currentDate)}
          </span>
          <button onClick={handleNext} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
        <button className="today-btn" onClick={goToToday}>
          Today
        </button>
      </div>

      <div className="day-switcher">
        <button
          className={`day-btn ${view === "day" ? "active" : ""}`}
          onClick={() => setView("day")}
        >
          Day
        </button>
        <button
          className={`day-btn ${view === "week" ? "active" : ""}`}
          onClick={() => setView("week")}
        >
          Week
        </button>
      </div>

      {projectID && (
        <button
          className="add-event-btn"
          onClick={() => setShowAddForm((show) => !show)}
          aria-expanded={showAddForm}
          aria-controls="add-event-form"
        >
          <Plus size={16} /> Add Event
        </button>
      )}

      {projectID && showAddForm && (
        <form
          id="add-event-form"
          className="add-event-form"
          onSubmit={handleAddEvent}
        >
          <input
            type="text"
            placeholder="Event Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={newStart}
            onChange={(e) => setNewStart(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={newEnd}
            onChange={(e) => setNewEnd(e.target.value)}
            required
          />

          <div className="add-event-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-event-btn"
            >
              Cancel
            </button>
            <button type="submit" className="save-event-btn">
              Save
            </button>
          </div>
        </form>
      )}

      <ul className="events-list">
        {isLoading ? (
          <p className="no-events">Loading events...</p>
        ) : error ? (
          <p className="no-events">Failed to load events.</p>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventComponent
              key={event.id}
              event={event}
              showActions={showActions}
              onDelete={deleteEvent}
              onEdit={updateEvent}
            />
          ))
        ) : (
          <p className="no-events">
            No events for {view === "day" ? "this day" : "this week"}.
          </p>
        )}
      </ul>
    </div>
  );
};

export default Agenda;
