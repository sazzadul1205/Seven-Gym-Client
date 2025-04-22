// Enhanced parser for custom date formats
export const parseCustomDate = (input) => {
  if (!input) return null;

  // Handle both "T" and " " as separator between date and time
  const [datePart, timePartRaw] = input.split(/T| /);
  if (!datePart || !timePartRaw) return null;

  // Extract day, month, year
  const [day, month, year] = datePart.split("-");
  if (!day || !month || !year) return null;

  // Extract hour, minute, second (optional)
  const [hour = "00", minute = "00", second = "00"] = timePartRaw.split(":");

  // Create ISO-style string and return Date object
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};

// Format Date to readable string (e.g., "06 Apr 2025, 11:12 AM")
export const formatDate = (input) => {
  const dateObj = parseCustomDate(input);
  if (!dateObj) return "";

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return dateObj.toLocaleString("en-US", options);
};
