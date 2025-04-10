/**
 * Converts 24-hour time (e.g., "13:05") to 12-hour format with AM/PM (e.g., "1:05 PM").
 *
 * @param {string} timeStr - Time string in "HH:mm" 24-hour format.
 * @returns {string} - Time string in "h:mm AM/PM" 12-hour format.
 */
export const formatTime = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return "";

  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Ensure hour and minute are valid numbers
  if (isNaN(hour) || isNaN(minute)) return "";

  // Determine AM/PM
  const AMP = hour >= 12 ? "PM" : "AM";

  // Convert to 12-hour format (0 -> 12, 13 -> 1, etc.)
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  // Format with zero-padded minutes
  return `${hour12}:${minute.toString().padStart(2, "0")} ${AMP}`;
};
