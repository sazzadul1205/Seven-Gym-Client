export function extractDateOnly(dateTimeStr) {
  if (!dateTimeStr) return null;

  // Try to split by "T" or space — common datetime separators
  let datePart = dateTimeStr.split("T")[0];
  if (!datePart || datePart === dateTimeStr) {
    // If no "T", try space split
    datePart = dateTimeStr.split(" ")[0];
  }

  // Now we have the "date" portion, but might be in different formats like:
  // "01-06-2025", "2025-06-01", "01 06 2025", etc.
  // Let's try to normalize to "YYYY-MM-DD"

  // Extract all numeric parts from the date string
  const parts = datePart.match(/\d+/g);
  if (!parts || parts.length < 3) return null;

  // Heuristic: figure out which part is year (4 digits)
  let year, month, day;

  for (const part of parts) {
    if (part.length === 4) {
      year = part;
      break;
    }
  }

  if (!year) return null; // no valid year found

  // Now assign month and day from remaining parts
  // Remove year from parts array
  const filtered = parts.filter((p) => p !== year);

  // Guess month and day:
  // If both remaining parts <= 12, assume day and month, pick order based on common patterns
  // Default to month-day if ambiguous (US style)
  if (filtered.length < 2) return null;

  // Simple logic:
  if (filtered[0] > 12) {
    // first is day, second is month
    day = filtered[0].padStart(2, "0");
    month = filtered[1].padStart(2, "0");
  } else if (filtered[1] > 12) {
    // first is month, second is day
    month = filtered[0].padStart(2, "0");
    day = filtered[1].padStart(2, "0");
  } else {
    // both <= 12, assume day-month (traditional) since you want traditional approach
    day = filtered[0].padStart(2, "0");
    month = filtered[1].padStart(2, "0");
  }

  return `${year}-${month}-${day}`;
}
