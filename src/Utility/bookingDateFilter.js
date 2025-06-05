import { extractDateOnly } from "./extractDateOnly";

/**
 * Check if a booking matches a month-year filter
 * @param {string} bookingDateTime - The booking date string (ISO or similar)
 * @param {string} monthYearFilter - The filter string in 'YYYY-MM' format
 * @returns {boolean} - true if booking matches the filter or filter is empty
 */
export function isBookingInMonthYear(bookingDateTime, monthYearFilter) {
  if (!bookingDateTime) return false;

  const bookingDate = extractDateOnly(bookingDateTime);
  if (!bookingDate) return false;

  if (!monthYearFilter) return true;

  const bookingMonthYear = bookingDate.slice(0, 7); // 'YYYY-MM'

  return bookingMonthYear === monthYearFilter;
}
