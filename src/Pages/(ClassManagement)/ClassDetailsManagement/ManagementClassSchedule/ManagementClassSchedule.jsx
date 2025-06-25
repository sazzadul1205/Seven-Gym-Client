// Import Icons
import { IoSettings } from "react-icons/io5";

// Import Packages
import { Tooltip } from "react-tooltip";
import PropTypes from "prop-types";

const ManagementClassSchedule = ({ ClassScheduleData }) => {
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
    <section className="relative bg-gradient-to-bl from-gray-200/80 to-gray-500/50 p-2 md:p-10 mx-0 md:mx-10 rounded-none md:rounded-xl shadow-inner">
      {/* Settings Icon (Top Left) */}
      <>
        <div
          className="absolute top-2 right-2 bg-gray-600/90 p-3 rounded-full cursor-pointer "
          data-tooltip-id="Class_Schedule_Edit"
          onClick={() =>
            document.getElementById("Class_Schedule_Edit_Modal").showModal()
          }
        >
          <IoSettings className="text-red-500 text-3xl transition-transform duration-500 hover:rotate-180 hover:text-red-400" />
        </div>
        <Tooltip
          id="Class_Schedule_Edit"
          place="top"
          className="z-50"
          content="Edit Class Schedule "
        />
      </>

      {/* Header Section */}
      <header className="mb-4 border-b-2 border-gray-100 pb-3">
        <h3 className="text-2xl text-white font-semibold">Class Schedule</h3>
      </header>

      {/* Body Section */}
      <div className="overflow-x-auto">
        {/* Table Content */}
        <table className="w-full border-collapse border border-gray-300 text-left text-gray-900">
          {/* Table Header */}
          <thead className="bg-gray-300 uppercase text-sm font-medium tracking-wider">
            <tr>
              <th className="hidden md:flex border border-gray-300 px-4 py-3 w-12">
                #
              </th>
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
                <td className="hidden md:flex border border-gray-300 px-4 py-2 text-sm md:text-md font-medium">
                  {idx + 1}
                </td>
                {/* Day */}
                <td className="border border-gray-300 px-4 py-2 text-sm md:text-md capitalize">
                  {day}
                </td>
                {/* Start */}
                <td className="border border-gray-300 px-4 py-2 text-sm md:text-md font-mono">
                  {convertTo12HourFormat(startTime)}
                </td>
                {/* End */}
                <td className="border border-gray-300 px-4 py-2 text-sm md:text-md font-mono">
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
ManagementClassSchedule.propTypes = {
  ClassScheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ManagementClassSchedule;
