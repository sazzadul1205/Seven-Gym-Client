// Import Icons
import PropTypes from "prop-types";

// Import Utility
import { formatTimeTo12Hour } from "../../../../../../Utility/formatTimeTo12Hour";

const BookedSessionTable = ({ ScheduleByIDData }) => {
  return (
    <div className="p-3">
      {/* Title */}
      <h3 className="text-lg font-semibold py-2">Session Bookings</h3>

      {/* Schedule By Id  */}
      {ScheduleByIDData?.length > 0 ? (
        <>
          {/* Desktop View */}
          <div className="hidden md:flex">
            {/* Schedule By ID  */}
            <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mb-6">
              {/* Table Header */}
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Class Code</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Class Type</th>
                  <th className="px-4 py-2 border-b bg-gray-300 text-center">
                    Time
                  </th>
                  <th className="px-4 py-2 border-b bg-gray-300">Price</th>
                </tr>
              </thead>

              {/* Table Content */}
              <tbody>
                {ScheduleByIDData?.map((s, idx) => (
                  <tr
                    key={`${s.id}-${idx}`}
                    className="bg-gray-50 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                  >
                    {/* Day */}
                    <td className="px-4 py-2">{s.day}</td>

                    {/* Class Code */}
                    <td className="px-4 py-2">{s.id}</td>

                    {/* Class Type */}
                    <td className="px-4 py-2">{s.classType}</td>

                    {/* Time */}
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <p className="w-16 md:w-20">
                          {formatTimeTo12Hour(s.start)}
                        </p>
                        <span>-</span>
                        <p className="w-16 md:w-20">
                          {formatTimeTo12Hour(s.end)}
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-2">
                      {s.classPrice === "free" || s.classPrice === "Free"
                        ? "Free"
                        : `$ ${s.classPrice}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden flex-col mb-6">
            {ScheduleByIDData.map((s, idx) => (
              <div
                key={`${s.id}-${idx}`}
                className={`text-black text-center ${
                  idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                } md:rounded-xl p-5 shadow-md border-2 border-gray-300`}
              >
                {/* Day */}
                <h4>{s.day}</h4>

                {/* Class Type */}
                <p className="text-xl font-semibold">{s.classType}</p>

                {/* Time */}
                <div className="flex justify-center gap-2">
                  <p>{formatTimeTo12Hour(s.start)}</p>
                  <span>-</span>
                  <p>{formatTimeTo12Hour(s.end)}</p>
                </div>

                {/* Price */}
                <p className="font-bold text-lg">
                  {" "}
                  {s.classPrice === "free" || s.classPrice === "Free"
                    ? "Free"
                    : `$ ${s.classPrice}`}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        // If No Session Available
        <p className="text-center text-xl">No sessions available</p>
      )}
    </div>
  );
};

BookedSessionTable.propTypes = {
  ScheduleByIDData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      day: PropTypes.string.isRequired,
      classType: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired, // expected "HH:mm"
      end: PropTypes.string.isRequired, // expected "HH:mm"
      classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
};

export default BookedSessionTable;
