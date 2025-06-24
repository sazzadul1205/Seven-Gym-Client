// Enhanced parser for both ISO and custom date formats
export const parseCustomDate = (input) => {
  if (!input) return null;

  // Try native Date parse first (handles ISO like "2025-06-01T03:46:45.142Z")
  const isoDate = new Date(input);
  if (!isNaN(isoDate)) return isoDate;

  // Handle custom formats like "31-05-2025 01:38:07"
  const [datePart, timePartRaw] = input.split(/T| /);
  if (!datePart || !timePartRaw) return null;

  const [day, month, year] = datePart.split("-");
  if (!day || !month || !year) return null;

  const [hour = "00", minute = "00", second = "00"] = timePartRaw.split(":");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
};

// Format Date to readable string
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
