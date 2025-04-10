import { parseCustomDate } from "./formatDate"; // Importing the custom date parsing function

/**
 * Calculates how much time is left before a request expires, based on a 1-week expiry window.
 * The input date format should be "dd-mm-yyyyTHH:mm".
 * @param {string} input - The start date in the format "dd-mm-yyyyTHH:mm".
 * @param {Date} now - The current date and time to compare against.
 * @returns {string} - A string that describes how much time is left, or "Expired" if the time window is over.
 */
export const getRemainingTime = (input, now) => {
  // Step 1: Parse the input string into a JavaScript Date object.
  const startDate = parseCustomDate(input);

  // If the date parsing fails (invalid date), return an error message.
  if (!startDate) return "Invalid date";

  // Step 2: Calculate the expiry date by adding 7 days to the start date.
  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + 7); // Adding 7 days to the start date

  // Step 3: Calculate the difference in milliseconds between the expiry date and the current date.
  const diff = expiry - now;

  // If the difference is less than or equal to 0, the request has expired.
  if (diff <= 0) return "Expired";

  // Step 4: Break down the difference into days, hours, and minutes.
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24); // Get remaining hours after converting to days
  const minutes = Math.floor((diff / (1000 * 60)) % 60); // Get remaining minutes after converting to hours

  // Step 5: Return a formatted string showing how much time is left.
  return `${days}d ${hours}h ${minutes}m left`;
};
