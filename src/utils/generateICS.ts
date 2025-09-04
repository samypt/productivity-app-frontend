import { components } from "../types/api";

type Event = components["schemas"]["EventFull"];

export const generateICS = (event: Event) => {
  const formatICS = (date: string) =>
    new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${""}
DTSTART:${formatICS(event.start_time)}
DTEND:${formatICS(event.end_time)}
END:VEVENT
END:VCALENDAR`;
};
