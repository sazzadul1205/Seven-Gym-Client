/**
 * Converts a 24-hour time string (e.g., "14:30") to 12-hour format with AM/PM (e.g., "2:30 PM").
 *
 * @param {string} time - A string representing time in 24-hour format ("HH:mm").
 * @returns {string} - Formatted time string in 12-hour format with AM/PM, or an empty string if invalid input.
 */
export const formatTimeTo12Hour = (time) => {
  if (!time || typeof time !== "string") return "";

  const parts = time.split(":");

  // Ensure valid format
  if (parts.length !== 2) return "";

  const [hourStr, minute] = parts;
  const hour = parseInt(hourStr, 10);

  // Validate hour and minute values
  if (isNaN(hour) || isNaN(parseInt(minute, 10))) return "";

  // Determine AM or PM
  const amPm = hour >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

  // Pad minute if needed
  const paddedMinute = minute.padStart(2, "0");

  return `${formattedHour}:${paddedMinute} ${amPm}`;
};
