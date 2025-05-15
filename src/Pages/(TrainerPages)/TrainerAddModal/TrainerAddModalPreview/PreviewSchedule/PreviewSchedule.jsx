import PropTypes from "prop-types";

const PreviewSchedule = ({ trainerSchedule }) => {
  // If schedule isn't available or still loading, show a loading message
  if (
    !trainerSchedule ||
    !trainerSchedule.trainerSchedule ||
    Object.keys(trainerSchedule.trainerSchedule).length === 0
  ) {
    return (
      <div className="flex justify-center items-center h-40 text-green-600 text-lg font-semibold animate-pulse">
        ⏳ Loading trainer schedule...
      </div>
    );
  }

  // Extract the scheduled days (keys of the trainerSchedule object)
  const selectedDays = Object.keys(trainerSchedule.trainerSchedule);

  // Prepare the time range headers using one sample day
  const ranges = [];
  const sampleDay = trainerSchedule.trainerSchedule[selectedDays[0]];
  for (const time in sampleDay) {
    const start = time;
    const end = sampleDay[time].end;
    ranges.push({ start, end });
  }

  return (
    <div className="p-2">
      {/* Trainer Name */}
      <h4 className="text-xl font-bold mb-4 text-center text-black">
        Schedule for {trainerSchedule?.trainerName}
      </h4>

      {/* Table container with styling */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Head: Day / Time headers */}
          <thead className="bg-green-100 sticky top-0 z-10">
            <tr>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                Day / Time
              </th>
              {ranges.map((range) => (
                <th
                  key={range?.start}
                  className="text-center px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  {range?.start} - {range?.end}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body: Row per day, columns per time slot */}
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedDays.map((day, index) => (
              <tr
                key={day}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                {/* Day Name */}
                <td className="px-4 py-2 text-sm font-semibold text-gray-800 text-center">
                  {day}
                </td>

                {/* Time Slots */}
                {ranges.map((range) => {
                  const hasSlot =
                    trainerSchedule.trainerSchedule[day]?.[range.start];

                  return (
                    <td
                      key={range.start}
                      className={`px-4 py-2 text-center text-lg ${
                        hasSlot ? "text-green-600 font-bold" : "text-gray-300"
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

// Prop Validation
PreviewSchedule.propTypes = {
  trainerSchedule: PropTypes.shape({
    trainerName: PropTypes.string.isRequired,
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          end: PropTypes.string.isRequired, // time range end (e.g., "08:00")
        })
      )
    ).isRequired,
  }),
};

export default PreviewSchedule;
