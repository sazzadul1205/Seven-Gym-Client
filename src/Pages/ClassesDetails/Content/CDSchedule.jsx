/* eslint-disable react/prop-types */
const CDSchedule = ({ ClassScheduleData }) => {
  // Define the order of days for sorting
  const daysOrder = [
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];

  // Sort ClassScheduleData based on the defined day order
  const sortedSchedule = [...ClassScheduleData].sort(
    (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
  );

  return (
    <div className="max-w-[1200px] mx-auto">
      <p className="text-xl font-bold py-4">Class Schedule</p>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-200">
          {/* Table Head */}
          <thead className="bg-gray-200">
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
                  {schedule.startTime}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {schedule.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CDSchedule;
