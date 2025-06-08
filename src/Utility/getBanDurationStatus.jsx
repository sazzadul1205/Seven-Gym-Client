/**
 * getBanDurationStatus - Returns a JSX element indicating the user's ban status.
 *
 * @param {Object} ban - The ban object containing Duration and End fields.
 * @returns {JSX.Element|null} - A styled message representing the ban state.
 */
export function getBanDurationStatus(ban) {
  if (!ban) return null;

  // Check for permanent ban using Duration or End field
  const isPermanent =
    (ban.Duration && ban.Duration.toLowerCase() === "permanent") ||
    (ban.End && ban.End.toLowerCase() === "indefinite");

  if (isPermanent) {
    return <span className="text-red-800 font-bold">Permanent Ban</span>;
  }

  // Parse the end date and check for invalid format
  const now = new Date();
  const end = new Date(ban.End);
  if (isNaN(end.getTime())) {
    return <span className="text-gray-500">Invalid ban end date</span>;
  }

  // If the ban has already expired
  if (end <= now) {
    return <span className="text-green-600 font-semibold">Ban expired</span>;
  }

  // Calculate time difference between now and end date
  const diffMs = end - now;
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );
  const days = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
  );

  // Build human-readable string for time left
  let timeLeftStr = "";
  if (years > 0) timeLeftStr += `${years} year${years > 1 ? "s" : ""} `;
  if (months > 0) timeLeftStr += `${months} month${months > 1 ? "s" : ""} `;
  if (days > 0) timeLeftStr += `${days} day${days > 1 ? "s" : ""}`;

  // Return formatted JSX
  return (
    <span className="text-red-600 font-semibold">
      UnBan in {timeLeftStr.trim() || "less than a day"}
    </span>
  );
}
