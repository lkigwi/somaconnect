const MONTHS = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };

export const getJitsiUrl = (bookingId) =>
  `https://meet.jit.si/SomaConnect-${bookingId}`;

// Parse "Thu, 10 Jun 2026" + "4:00 PM" → Date
export const parseSessionDateTime = (dateStr, timeStr) => {
  try {
    const parts = dateStr.replace(',', '').split(/\s+/).filter(Boolean);
    const day = parseInt(parts[1], 10);
    const month = MONTHS[parts[2]] ?? 0;
    const year = parseInt(parts[3], 10);
    const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
    if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
    return new Date(year, month, day, h, min, 0);
  } catch {
    return null;
  }
};

// Returns minutes until session start (negative = already started)
export const minutesUntilSession = (dateStr, timeStr) => {
  const dt = parseSessionDateTime(dateStr, timeStr);
  if (!dt) return null;
  return (dt - new Date()) / 60000;
};

// Tutor can join 10 min before
export const tutorCanJoin = (dateStr, timeStr) => {
  const mins = minutesUntilSession(dateStr, timeStr);
  return mins !== null && mins <= 10;
};

// Student joins at start time
export const studentCanJoin = (dateStr, timeStr) => {
  const mins = minutesUntilSession(dateStr, timeStr);
  return mins !== null && mins <= 0;
};

export const formatCountdown = (dateStr, timeStr) => {
  const mins = minutesUntilSession(dateStr, timeStr);
  if (mins === null) return null;
  if (mins <= 0) return 'Live now';
  if (mins <= 60) return `Starts in ${Math.ceil(mins)} min`;
  const hrs = Math.floor(mins / 60);
  const remaining = Math.ceil(mins % 60);
  return `Starts in ${hrs}h ${remaining}m`;
};
