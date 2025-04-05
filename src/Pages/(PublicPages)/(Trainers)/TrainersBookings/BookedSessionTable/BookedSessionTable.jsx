import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FaBookmark, FaTrash } from "react-icons/fa";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
};

const BookedSessionTable = ({ listedSessions, setListedSessions }) => {
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(1);

  // Group by classType + classPrice, count and subtotal
  const { groups, baseGrandTotal } = useMemo(() => {
    const map = {};
    let total = 0;

    listedSessions.forEach((s) => {
      const priceNum = Number(s.classPrice) || 0;
      const key = `${s.classType}-${priceNum}`;
      if (!map[key]) {
        map[key] = {
          classType: s.classType,
          classPrice: priceNum,
          count: 0,
          subtotal: 0,
        };
      }
      map[key].count += 1;
      map[key].subtotal += priceNum;
      total += priceNum;
    });

    return {
      groups: Object.values(map),
      baseGrandTotal: total,
    };
  }, [listedSessions]);

  // Duration options (in weeks)
  const durations = [1, 2, 4, 12, 24, 36, 48, 52];

  // Adjusted totals based on selected duration
  const adjustedGroups = groups.map((g) => ({
    ...g,
    adjustedSubtotal: g.subtotal * duration,
  }));
  const adjustedGrandTotal = baseGrandTotal * duration;

  return (
    <div className="bg-gradient-to-b from-gray-500/80 to-gray-500/50 py-5">
      <div className="max-w-7xl mx-auto bg-white/80 rounded-xl p-5">
        {/* Title */}
        <h2 className="flex items-center text-xl font-bold mb-2">
          <FaBookmark className="text-green-500 mr-2" />
          Bookings List
        </h2>
        <div className="h-[1px] bg-black mb-4" />

        {/* Sessions Table */}
        {listedSessions.length > 0 ? (
          <>
            <table className="table-auto w-full border-collapse text-left border border-gray-300 text-black mb-6">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b bg-gray-300">Day</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Class Code</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Class Type</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Time</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Price</th>
                  <th className="px-4 py-2 border-b bg-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {listedSessions.map((s, idx) => (
                  <tr key={`${s.id}-${idx}`} className="bg-gray-50">
                    <td className="px-4 py-2">{s.day}</td>
                    <td className="px-4 py-2">{s.id}</td>
                    <td className="px-4 py-2">{s.classType}</td>
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
                    <td className="px-4 py-2">{`$ ${s.classPrice}`}</td>
                    <td className="px-4 py-2">
                      <CommonButton
                        icon={<FaTrash />}
                        iconSize="text-md"
                        bgColor="red"
                        px="px-4"
                        py="py-2"
                        // clickEvent={() => handleRemove(s.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pricing Summary */}
            <div className="bg-gray-100 text-black p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-2">Pricing Summary</h3>
              <ul className="space-y-1 mb-4">
                {adjustedGroups.map(
                  ({ classType, classPrice, count, adjustedSubtotal }) => (
                    <li
                      key={`${classType}-${classPrice}`}
                      className="flex justify-between bg-gray-300 hover:bg-gray-400 py-2 px-5"
                    >
                      <span>
                        {classType} (${classPrice}) × {count} × {duration} Session
                        {duration > 1 ? "s" : ""}
                      </span>
                      <span>${adjustedSubtotal.toFixed(2)}</span>
                    </li>
                  )
                )}
              </ul>

              {/* Duration Picker Boxes */}
              <div className="flex flex-wrap items-center gap-2 py-2 border-t border-gray-400 ">
                <p className="font-semibold" >Pick Duration :</p>
                {durations.map((w) => (
                  <button
                    key={w}
                    onClick={() => setDuration(w)}
                    className={`px-4 py-2 border rounded cursor-pointer ${
                      duration === w
                        ? "bg-blue-600 text-white bg-linear-to-bl from-blue-300 to-blue-600"
                        : "border-3 border-white text-black  bg-linear-to-tr hover:bg-linear-to-bl from-blue-200 to-blue-400"
                    }`}
                  >
                    {w} week{w > 1 ? "'s" : ""}
                  </button>
                ))}
              </div>

              {/* Grand Total */}
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Grand Total:</span>
                <span className="text-xl font-bold text-green-600">
                  ${adjustedGrandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            No schedule booked yet. Please select a session.
          </p>
        )}

        {/* Book Session Button */}
        <div className="flex justify-end">
          <CommonButton
            text="Book Session"
            loadingText="Booking..."
            isLoading={loading}
            bgColor="OriginalRed"
            borderRadius="rounded-xl"
            px="px-4"
            py="py-2"
            width="[250px]"
            disabled={listedSessions.length === 0}
            // clickEvent={handleSubmitBooking}
          />
        </div>
      </div>
    </div>
  );
};

BookedSessionTable.propTypes = {
  listedSessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      classType: PropTypes.string.isRequired,
      classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    })
  ).isRequired,
  setListedSessions: PropTypes.func.isRequired,
};

export default BookedSessionTable;
