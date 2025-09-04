import { components } from "../types/api";
import { generateICS } from "./generateICS";

type Event = components["schemas"]["EventFull"];

export const handleAddToAppleCalendar = (event: Event) => {
  const blob = new Blob([generateICS(event)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isMac = navigator.userAgent.includes("Macintosh");

  if (isSafari && isMac) {
    // Try to open directly in Apple Calendar
    window.location.href = url;
  } else {
    // Force download for compatibility
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
