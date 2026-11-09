const MINUTES_PER_DAY = 24 * 60;

const padTwoDigits = (value: number): string => String(value).padStart(2, "0");

// Today plus a number of days, as "YYYY-MM-DD" in the user's own time zone
export const getIsoDateFromToday = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`;
};

// "Monday, April 14" (long) or "Mon, April 14" (short)
export const formatDate = (
  isoDate: string,
  style: "long" | "short" = "long",
): string =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: style,
    month: "long",
    day: "numeric",
  });

const toTotalMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatClockTime = (totalMinutes: number): string => {
  const minutesIntoDay = totalMinutes % MINUTES_PER_DAY;
  const hours24 = Math.floor(minutesIntoDay / 60);
  const minutes = minutesIntoDay % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${padTwoDigits(hours12)}:${padTwoDigits(minutes)} ${suffix}`;
};

// "08:00 AM – 09:00 AM"
export const formatTimeRange = (
  startTime: string,
  durationMins: number,
): string => {
  const start = toTotalMinutes(startTime);
  return `${formatClockTime(start)} – ${formatClockTime(start + durationMins)}`;
};

export const formatPrice = (amount: number, withDecimals = false): string =>
  `Rs. ${new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(amount)}`;

export const getInitials = (fullName: string): string =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export const formatClassCode = (classId: number): string =>
  `#CL-${String(classId).padStart(4, '0')}`;

// "Apr 2026"
export const formatMonthYear = (isoDate: string): string =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });