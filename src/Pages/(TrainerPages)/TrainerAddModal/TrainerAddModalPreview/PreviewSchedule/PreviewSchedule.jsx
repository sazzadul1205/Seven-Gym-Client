import PropTypes from "prop-types";

const PreviewSchedule = ({ trainerSchedule }) => {
  // Handle loading state
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

  const selectedDays = Object.keys(trainerSchedule.trainerSchedule);
  const ranges = [];

  const sampleDay = trainerSchedule.trainerSchedule[selectedDays[0]];
  for (const time in sampleDay) {
    ranges.push({ start: time, end: sampleDay[time].end });
  }

  return (
    <div className="p-2">
      {/* Title */}
      <h4 className="text-xl font-bold mb-4 text-center text-black">
        Schedule for {trainerSchedule?.trainerName}
      </h4>

      {/* Desktop View (Table) */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
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
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedDays.map((day, index) => (
              <tr
                key={day}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2 text-sm font-semibold text-gray-800 text-center">
                  {day}
                </td>
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

      {/* Mobile View (Cards) */}
      <div className="sm:hidden space-y-4">
        {selectedDays.map((day) => (
          <div
            key={day}
            className="border border-gray-300 rounded-md p-4 shadow-sm bg-white"
          >
            <h5 className="text-md font-bold text-green-700 mb-2">{day}</h5>

            {ranges.map((range) => {
              const hasSlot =
                trainerSchedule.trainerSchedule[day]?.[range.start];

              return (
                <div
                  key={range.start}
                  className="flex justify-between items-center py-1 border-b last:border-b-0"
                >
                  <span className="text-sm text-gray-700 font-medium">
                    {range.start} - {range.end}
                  </span>
                  <span
                    className={`text-lg ${
                      hasSlot ? "text-green-600 font-bold" : "text-gray-300"
                    }`}
                  >
                    {hasSlot ? "✅" : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

PreviewSchedule.propTypes = {
  trainerSchedule: PropTypes.shape({
    trainerName: PropTypes.string.isRequired,
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          end: PropTypes.string.isRequired,
        })
      )
    ).isRequired,
  }),
};

export default PreviewSchedule;
