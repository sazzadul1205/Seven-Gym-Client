// Import Icons
import PropTypes from "prop-types";

// Import Utility
import { formatTimeTo12Hour } from "../../../../../../Utility/formatTimeTo12Hour";

const BookingActivityTable = ({ ScheduleByIDData }) => {
  return (
    <>
      {/* Title */}
      <h3 className="text-lg font-bold p-2">Weekly Session Schedule</h3>

      {ScheduleByIDData?.length > 0 ? (
        <>
          {/* Desktop view table */}
          <div className="hidden md:flex overflow-x-auto">
            <table className="table-auto border-collapse w-full text-sm text-center text-black shadow-md">
              {/* Table header with days of the week */}
              <thead>
                <tr className="border-b bg-gray-700 text-white">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <th key={day} className="px-4 py-2 border">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table content for each day */}
              <tbody>
                <tr>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => {
                    // Filter sessions by day
                    const sessions =
                      ScheduleByIDData?.filter((s) => s.day === day) || [];

                    return (
                      <td
                        key={day}
                        className="min-w-[120px] align-top cursor-default"
                      >
                        {sessions.length > 0 ? (
                          // Display sessions for the day
                          sessions.map((s, idx) => (
                            <div
                              key={idx}
                              className="p-2 bg-linear-to-br hover:bg-linear-to-tr from-green-100 to-green-300 text-xs border border-gray-400"
                            >
                              {/* Class type */}
                              <p className="font-semibold">{s.classType}</p>

                              {/* Time range */}
                              <p>
                                {formatTimeTo12Hour(s.start)} -{" "}
                                {formatTimeTo12Hour(s.end)}
                              </p>

                              {/* Price display */}
                              <p className="italic text-bold font-semibold">
                                {s.classPrice === "free" ||
                                s.classPrice === "Free"
                                  ? "Free"
                                  : `$ ${s.classPrice}`}
                              </p>
                            </div>
                          ))
                        ) : (
                          // If no sessions available
                          <div className="p-2 bg-linear-to-br hover:bg-linear-to-tr from-red-100 to-red-300 text-xs border border-gray-400 py-6 cursor-default">
                            <p className="text-red-500 font-bold italic">
                              No sessions
                            </p>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile view (accordion-style) */}
          <div className="flex md:hidden space-y-4">
            <div className="w-full">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => {
                // Filter sessions by day
                const sessions =
                  ScheduleByIDData?.filter((s) => s.day === day) || [];

                return (
                  <div key={day} className="border-b pb-4">
                    {/* Day title */}
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {day}
                    </h3>

                    {sessions.length > 0 ? (
                      // Display each session
                      sessions.map((s, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-green-100 to-green-300 p-3 mb-2 border border-gray-400"
                        >
                          <p className="font-semibold">{s.classType}</p>
                          <p>
                            {formatTimeTo12Hour(s.start)} -{" "}
                            {formatTimeTo12Hour(s.end)}
                          </p>
                          <p className="italic font-semibold">
                            {s.classPrice === "free" || s.classPrice === "Free"
                              ? "Free"
                              : `$ ${s.classPrice}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      // If no sessions available
                      <div className="bg-gradient-to-br from-red-100 to-red-300 p-3 mb-2 border border-gray-400">
                        <p className="text-red-500 font-bold italic">
                          No sessions
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        // If No Session Available
        <p className="text-center text-xl">No sessions available</p>
      )}
    </>
  );
};

// Prop validation
BookingActivityTable.propTypes = {
  ScheduleByIDData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      classType: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
};

export default BookingActivityTable;
