// Parse custom date string (Format: "06-04-2025T11:12")
// Converts a custom-formatted date string into a JavaScript Date object
export const parseCustomDate = (input) => {
  if (!input) return null;

  // Split the input into date and time parts
  const [datePart, timePart] = input.split("T");

  // Extract day, month, year from the date part
  const [day, month, year] = datePart.split("-");

  // Extract hour and minute from the time part
  const [hour, minute] = timePart.split(":");

  // Return a new Date object with ISO string format (YYYY-MM-DDTHH:mm)
  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
};

// Format Date to readable string (e.g., "06 Apr 2025, 11:12 AM")
// Takes a custom date string and returns a formatted string
export const formatDate = (input) => {
  // First, parse the custom string into a Date object
  const dateObj = parseCustomDate(input);
  if (!dateObj) return "";

  // Define formatting options for toLocaleString
  const options = {
    day: "2-digit", // Display day with 2 digits (e.g., "06")
    month: "short", // Display short month name (e.g., "Apr")
    year: "numeric", // Display 4-digit year (e.g., "2025")
    hour: "numeric", // Display hour in numeric format
    minute: "2-digit", // Display minute with 2 digits (e.g., "09")
    hour12: true, // Use 12-hour format with AM/PM
  };

  // Return formatted date string
  return dateObj.toLocaleString("en-US", options);
};
