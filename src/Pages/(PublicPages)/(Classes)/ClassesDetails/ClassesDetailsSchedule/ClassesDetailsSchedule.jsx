import PropTypes from "prop-types";

const ClassesDetailsSchedule = ({ ClassScheduleData }) => {
  const daysOrder = [
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  // Convert 24h time "HH:mm" to 12h time with AM/PM
  const convertTo12HourFormat = (time) => {
    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Sort schedule by predefined day order
  const sortedSchedule = [...ClassScheduleData].sort(
    (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
  );

  return (
    <section
      aria-labelledby="class-schedule-title"
      className="bg-gradient-to-bl from-gray-200/80 to-gray-400/50 p-6 mx-4 md:mx-32 rounded-xl shadow-inner"
    >
      <header className="mb-4 border-b-2 border-gray-100 pb-3">
        <h3 className="text-2xl text-white font-semibold">Class Schedule</h3>
      </header>

      <div className="overflow-x-auto">
        {/* Table Content */}
        <table className="w-full border-collapse border border-gray-300 text-left text-gray-900">
          {/* Table Header */}
          <thead className="bg-gray-300 uppercase text-sm font-medium tracking-wider">
            <tr>
              <th className="border border-gray-300 px-4 py-3 w-12">#</th>
              <th className="border border-gray-300 px-4 py-3">Day</th>
              <th className="border border-gray-300 px-4 py-3">Start Time</th>
              <th className="border border-gray-300 px-4 py-3">End Time</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedSchedule.map(({ day, startTime, endTime }, idx) => (
              <tr
                key={`${day}-${startTime}-${endTime}`}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                {/* index */}
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  {idx + 1}
                </td>
                {/* Day */}
                <td className="border border-gray-300 px-4 py-2 capitalize">
                  {day}
                </td>
                {/* Start */}
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  {convertTo12HourFormat(startTime)}
                </td>
                {/* End */}
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  {convertTo12HourFormat(endTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// Prop Validation
ClassesDetailsSchedule.propTypes = {
  ClassScheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ClassesDetailsSchedule;
