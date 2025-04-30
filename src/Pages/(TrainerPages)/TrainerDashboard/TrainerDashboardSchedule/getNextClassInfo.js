// Main function to retrieve the next upcoming classes based on the trainer's schedule
const getNextClassesInfo = (scheduleData) => {
  // If no data is provided, return an empty array
  if (!scheduleData?.length) return [];

  const today = new Date();

  // Days of the week for mapping day names
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Current time in decimal hours (e.g., 14.5 for 2:30 PM)
  const nowTime = today.getHours() + today.getMinutes() / 60;

  // Get trainer's schedule object (assumes first element of array contains it)
  const trainerSchedule = scheduleData[0]?.trainerSchedule || {};
  const upcoming = [];

  // Iterate over each day and its sessions
  for (const [day, times] of Object.entries(trainerSchedule)) {
    for (const [time, session] of Object.entries(times)) {
      // Get the actual date for the next occurrence of this weekday
      const classDate = getNextDateForDay(day);

      // Parse hour and minute from time string (e.g., "14:30")
      const [hour, minute] = time.split(":").map(Number);
      const sessionTime = hour + minute / 60;

      // Add to upcoming list if session is in the future (date or time)
      if (
        classDate.toDateString() > today.toDateString() ||
        (classDate.toDateString() === today.toDateString() &&
          sessionTime > nowTime)
      ) {
        upcoming.push({
          ...session,
          dateObj: classDate,
          sessionTime,
        });
      }
    }
  }

  // If there are no upcoming sessions, return an empty array
  if (!upcoming.length) return [];

  // Sort sessions by date and then by start time
  upcoming.sort(
    (a, b) => a.dateObj - b.dateObj || a.sessionTime - b.sessionTime
  );

  // Return the next two sessions formatted with relevant display data
  return upcoming.slice(0, 2).map((next) => ({
    date: formatDate(next.dateObj),
    day: days[next.dateObj.getDay()],
    start: formatTime(next.start),
    end: formatTime(next.end),
    classType: next.classType,
    participantCount: Array.isArray(next.participant)
      ? next.participant.length
      : 0,
  }));
};

// Helper to get the next date for a given day of the week
const getNextDateForDay = (dayName) => {
  const today = new Date();
  const todayIndex = today.getDay();

  // Get index for the target weekday (0-6)
  const targetIndex = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].indexOf(dayName);

  // Calculate how many days ahead the target weekday is
  const diff = (targetIndex - todayIndex + 7) % 7 || 7;

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + diff); // Move to that future day
  return nextDate;
};

// Helper to convert time string (24h) to 12-hour AM/PM format
const formatTime = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
};

// Helper to format a Date object into dd-mm-yyyy format
const formatDate = (date) => {
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;
};

export default getNextClassesInfo;
