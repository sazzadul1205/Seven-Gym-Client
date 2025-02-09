const TodaysSchedule = () => {
  // Generate time slots from 12:00 AM to 11:00 PM in 12-hour format
  const timeSlots = Array.from({ length: 24 }, (_, index) => {
    const hour = index % 12 || 12; // Convert 0 to 12 for AM format
    const period = index < 12 ? "AM" : "PM";
    return `${hour}:00 ${period}`;
  });

  return (
    <div className="p-4">
      {/* Title */}
      <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
        TODAY&apos;S SCHEDULE
      </p>

      {/* Schedule List */}
      <div className="pt-4 space-y-3">
        {timeSlots.map((time, index) => (
          <div key={index} className="flex items-center gap-3 w-full">
            {/* Time Label */}
            <p className="font-semibold text-gray-700 w-20 text-right">
              {time}
            </p>

            {/* Event Placeholder (Can be dynamic) */}
            <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105">
              No Event
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysSchedule;
