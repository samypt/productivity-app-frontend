import { Calendar, View, Views, dateFnsLocalizer } from "react-big-calendar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { enUS } from "date-fns/locale/en-US";
import "./MyCalendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const defaultEvents = [
  {
    title: "My Event",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
  },
];

export default function MyCalendar() {
  const [events, setEvents] = useState(defaultEvents);
  const [view, setView] = useState<View>(Views.MONTH);
  console.log(view);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-wrapper">
        <div className="calendar-title-bar">
          <h2>Calendar</h2>
        </div>
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={view}
            view={view}
            onView={setView}
            selectable
            onSelectSlot={(slotInfo) => {
              const title = window.prompt("Event title:");
              if (title) {
                setEvents([
                  ...events,
                  {
                    title,
                    start: slotInfo.start,
                    end: slotInfo.end,
                  },
                ]);
              }
            }}
            onSelectEvent={(event) => alert(`Selected: ${event.title}`)}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </DndProvider>
  );
}

// export default function MyCalendar() {
//   const [events, setEvents] = useState(defaultEvents);
//   const [view, setView] = useState<View>(Views.MONTH);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="calendar-container">
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           defaultView={view}
//           selectable
//           onSelectSlot={(slotInfo) => {
//             const title = window.prompt("Event title:");
//             if (title) {
//               setEvents([
//                 ...events,
//                 {
//                   title,
//                   start: slotInfo.start,
//                   end: slotInfo.end,
//                 },
//               ]);
//             }
//           }}
//           onSelectEvent={(event) => alert(`Selected: ${event.title}`)}
//           style={{ height: "100%" }}
//           onView={(newView) => setView(newView)}
//           view={view}
//         />
//       </div>
//     </DndProvider>
//   );
// }
