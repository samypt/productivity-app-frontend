import { components } from "../types/api";

type Event = components["schemas"]["EventFull"];

export const generateGoogleCalendarURL = (event: Event) => {
  const start = new Date(event.start_time)
    .toISOString()
    .replace(/[-:]|\.\d{3}/g, "");
  const end = new Date(event.end_time)
    .toISOString()
    .replace(/[-:]|\.\d{3}/g, "");
  const text = encodeURIComponent(event.title || "");
  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent("");

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
};
