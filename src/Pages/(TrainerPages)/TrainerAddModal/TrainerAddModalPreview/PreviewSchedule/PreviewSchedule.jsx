const PreviewSchedule = ({ trainerSchedule }) => {
  // Extract the days and time slots from the schedule
  const selectedDays = trainerSchedule.trainerSchedule; // Get the days (e.g., Monday, Tuesday, etc.)

  // Create an array of time ranges (e.g., 07:00 - 07:59, 08:00 - 08:59)
  const ranges = [];
  const sampleDay = trainerSchedule.trainerSchedule[selectedDays[0]]; // Just to get an example of times for the header
  for (const time in sampleDay) {
    const start = time;
    const end = sampleDay[time].end;
    ranges.push({ start, end });
  }

  return (
    <div className="mt-6">
      {/* Header showing the trainer name */}
      <h4 className="text-2xl font-bold mb-4 text-center text-green-700">
        ✅ Schedule for {trainerSchedule.trainerName}
      </h4>

      {/* Responsive table container with styling */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table head with day/time labels */}
          <thead className="bg-green-100 sticky top-0 z-10">
            <tr>
              {/* First column header for days */}
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                Day / Time
              </th>

              {/* Dynamically generate a column for each selected time range */}
              {ranges.map((range) => (
                <th
                  key={range.start}
                  className="text-center px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  {range.start} - {range.end}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body: each row represents a selected day */}
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedDays.map((day, index) => (
              <tr
                key={day}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"} // Alternate row color
              >
                {/* First cell shows the name of the day */}
                <td className="px-4 py-2 text-sm font-semibold text-gray-800 text-center">
                  {day}
                </td>

                {/* For each time range, render a cell indicating if a session exists */}
                {ranges.map((range) => {
                  // Check if the schedule has a slot for this day and time range
                  const hasSlot =
                    trainerSchedule.trainerSchedule?.[day]?.[range.start];

                  return (
                    <td
                      key={range.start}
                      className={`px-4 py-2 text-center text-lg ${
                        hasSlot
                          ? "text-green-600 font-bold" // If scheduled, show green checkmark
                          : "text-gray-300" // If not scheduled, show grey dash
                      }`}
                    >
                      {hasSlot ? "✅" : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewSchedule;
