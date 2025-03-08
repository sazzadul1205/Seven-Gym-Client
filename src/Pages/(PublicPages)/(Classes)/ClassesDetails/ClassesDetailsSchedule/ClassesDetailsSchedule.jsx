import PropTypes from "prop-types";

const ClassesDetailsSchedule = ({ ClassScheduleData }) => {
  // Define the order of days for sorting (starting from Friday)
  const daysOrder = [
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  // Helper function to convert time from 24-hour format to 12-hour AM/PM format
  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for AM
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  // Sort ClassScheduleData based on the predefined order of days
  const sortedSchedule = [...ClassScheduleData].sort(
    (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
  );

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-bl from-gray-200 to-gray-400 rounded-xl shadow-xl my-4 px-5 py-5">
      {/* Title Section */}
      <h3 className="text-2xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-100">
        Class Schedule
      </h3>

      {/* Table Container */}
      <div className="overflow-x-auto text-black pt-5">
        <table className="table w-full border-collapse border border-gray-200">
          {/* Table Head */}
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Day
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Start Time
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                End Time
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedSchedule.map((schedule, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {schedule.day}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {convertTo12HourFormat(schedule.startTime)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {convertTo12HourFormat(schedule.endTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PropTypes Validation
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
