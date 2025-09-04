import { useState } from "react";
import { Calendar, View, Views, dateFnsLocalizer } from "react-big-calendar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { components } from "../types/api";
import { EventEditModal } from "../components/events/modals/EventEditModal";
import { GoogleSyncButton } from "../components/common/GoogleSyncButton";
import { useFetchCalendatEvents } from "../api/events";
import { CalenderEvent, CustomEvent } from "../components/events/CustomEvent";
import { getColor } from "../utils/generateColor";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type EventFull = components["schemas"]["EventFull"];

export default function MyCalendar() {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(() => {
    const start = startOfMonth(new Date());
    return new Date(start.setHours(0, 0, 0, 0));
  });

  const [endDate, setEndDate] = useState(() => {
    const end = endOfMonth(new Date());
    return new Date(end.setHours(0, 0, 0, 0));
  });

  const handleSlotSelect = () => {
    console.log("Slot selected, implement your logic here");
  };

  const handleNavigate = (newDate: Date, view: View, action: string) => {
    // console.log("Navigated:", { newDate, view, action }); // <- "TODAY", "NEXT", "PREV"
    setStartDate(startOfMonth(newDate));
    setEndDate(endOfMonth(newDate));
    setDate(newDate);
  };

  const { events } = useFetchCalendatEvents(startDate, endDate);

  const calendarEvents: CalenderEvent[] = events.map((e) => ({
    ...e,
    start_date: new Date(e.start_time),
    end_date: new Date(e.end_time),
  }));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const findEventById = (id: string): EventFull | null => {
    return events.find((event) => event.id === id) || null;
  };
  const [eventId, setEventId] = useState<string | null>(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-wrapper">
        <div className="calendar-title-bar">
          <h2>Calendar</h2>
          <GoogleSyncButton />
        </div>
        <div className="calendar-container">
          <Calendar
            dayLayoutAlgorithm="no-overlap"
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start_date"
            endAccessor="end_date"
            defaultView={view}
            view={view}
            onView={setView}
            selectable
            onSelectSlot={handleSlotSelect}
            onSelectEvent={(event: CalenderEvent) => {
              setEventId(event.id);
              setIsEditModalOpen(true);
            }}
            // onRangeChange={(range) => {
            //   setStartDate(startOfMonth(range.start));
            //   setEndDate(endOfMonth(range.end));
            //   setDate(range.start);
            // }}
            // toolbar={true}
            components={{
              event: (props) => <CustomEvent {...props} view={view} />,
            }}
            date={date}
            onNavigate={handleNavigate}
            popup={true}
            eventPropGetter={(event: CalenderEvent) => {
              const teamColor = getColor(event.team.name);
              return {
                className: "custom-event-wrapper",
                style: {
                  background: "#fff",
                  borderRadius: "6px",
                  padding: "2px 6px",
                  fontWeight: 500,
                  border: `1px solid ${teamColor}`,
                  color: "#000",
                },
              };
            }}
            style={{ height: "100%" }}
          />
        </div>
      </div>

      {eventId && (
        <EventEditModal
          event={findEventById(eventId) || ({} as EventFull)}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => {}}
        />
      )}
    </DndProvider>
  );
}
