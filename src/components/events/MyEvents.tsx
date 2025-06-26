import React, { useState } from "react";
import EventComponent from "./EventComponent";
import { components } from "../../types/api";
import { useFetch } from "../../hooks";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "./MyEvents.style.css";

type EventsData = {
  [fieldName: string]: components["schemas"]["EventRead"][];
};

type ViewType = "day" | "week";

const MyEvents: React.FC = () => {
  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const endOfWeek = (date: Date) => {
    const start = startOfWeek(date);
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  };

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

  const { data, error, isLoading } = useFetch<EventsData>({
    url: `users/me/events?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
    queryKey: `my-events${startDate.toISOString()}${endDate.toISOString()}`,
  });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  const formatWeekRange = (date: Date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const isDayInRange = (startDate: Date, endDate: Date, selectedDate: Date) => {
    return (
      (startDate.getDate() === selectedDate.getDate() &&
        startDate.getMonth() === selectedDate.getMonth() &&
        startDate.getFullYear() === selectedDate.getFullYear()) ||
      (selectedDate >= startDate && selectedDate <= endDate)
    );
  };

  const isInWeek = (startDay: Date, endDay: Date) => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return startDay <= end && endDay >= start;
  };

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
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setStartDate(startOfWeek(new Date()));
    setEndDate(endOfWeek(new Date()));
  };

  const filteredEvents =
    data?.events?.filter((event) => {
      const eventStartDate = new Date(event.start_time);
      const eventEndDate = new Date(event.end_time);
      return view === "day"
        ? isDayInRange(eventStartDate, eventEndDate, currentDate)
        : isInWeek(eventStartDate, eventEndDate);
    }) || [];

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [events, setEvents] = useState(data?.events || []);

  // Add event form submit handler
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("Please enter a title.");
    if (!newStart || !newEnd)
      return alert("Please select start and end date/time.");
    if (new Date(newStart) > new Date(newEnd))
      return alert("Start time must be before or equal to end time.");

    // Create new event object (simplified)
    const newEvent = {
      id: Date.now().toString(), // simple id
      title: newTitle,
      start_time: newStart,
      end_time: newEnd,
      description: "",
      project_id: "",
      created_by: "",
      created_at: null,
    };

    setEvents((prev) => [...prev, newEvent]);
    // Clear form and hide
    setNewTitle("");
    setNewStart("");
    setNewEnd("");
    setShowAddForm(false);
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
        <button
          className="add-event-btn"
          onClick={() => setShowAddForm((show) => !show)}
          aria-expanded={showAddForm}
          aria-controls="add-event-form"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      {showAddForm && (
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
            autoFocus
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
          <button type="submit" className="save-event-btn">
            Save
          </button>
        </form>
      )}

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

      <ul className="events-list">
        {isLoading ? (
          <p className="no-events">Loading events...</p>
        ) : error ? (
          <p className="no-events">Failed to load events.</p>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventComponent key={event.id} event={event} />
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

export default MyEvents;
