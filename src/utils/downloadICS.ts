import { components } from "../types/api";
import { generateICS } from "./generateICS";

type Event = components["schemas"]["EventFull"];

export const downloadICS = (event: Event) => {
  const blob = new Blob([generateICS(event)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
