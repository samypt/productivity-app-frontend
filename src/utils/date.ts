export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

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

export function startOfMonth(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  return start;
}

export function endOfMonth(date: Date): Date {
  const end = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return end;
}

const formatIsoDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

export const formatWeekRange = (date: Date) => {
  const start = startOfWeek(date);
  console.log(" my function", startOfWeek(date));
  const end = endOfWeek(date);
  return `${formatIsoDate(start)} - ${formatIsoDate(end)}`;
};

export const isDayInRange = (
  startDate: Date,
  endDate: Date,
  selectedDate: Date
) =>
  (startDate.getDate() === selectedDate.getDate() &&
    startDate.getMonth() === selectedDate.getMonth() &&
    startDate.getFullYear() === selectedDate.getFullYear()) ||
  (selectedDate >= startDate && selectedDate <= endDate);

export const isInWeek = (startDay: Date, endDay: Date, currentDate: Date) => {
  const start = startOfWeek(currentDate);
  const end = endOfWeek(currentDate);
  return startDay <= end && endDay >= start;
};

export function formatDateString(date: Date | null): string {
  if (!date) return "Unknown";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
