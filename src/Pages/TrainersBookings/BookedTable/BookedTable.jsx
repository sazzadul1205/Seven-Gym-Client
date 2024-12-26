/* eslint-disable react/prop-types */

const BookedTable = ({
  SameTimeData,
  Day,
  listedSessions,
  setListedSessions,
  pricePerSession, // Now we have the price per session as a prop
}) => {
  // Get the schedule for the selected day
  const daySchedule = SameTimeData?.schedule?.[Day] || [];

  // Function to handle removing a clicked session
  const handleRemove = (sessionKey) => {
    setListedSessions((prev) =>
      prev.filter((session) => session.key !== sessionKey)
    );
  };

  // Function to calculate the total price for the listed sessions
  const calculateTotalPrice = () => {
    // Multiply the price per session by the number of booked sessions
    return listedSessions.length * pricePerSession;
  };

  return (
    <div className="p-4 bg-white max-w-7xl mx-auto my-5 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Bookings List</h2>

      {/* Original Schedule Section */}
      <div className="mb-6">
        {daySchedule.length > 0 || listedSessions.length > 0 ? (
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left w-1/4">Day</th>
                <th className="px-4 py-2 text-left w-1/4">Class Type</th>
                <th className="px-4 py-2 text-left w-1/4">Time</th>
                <th className="px-4 py-2 text-left w-1/4">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Display the original schedule (non-removable items) */}
              {daySchedule.map((session, index) => (
                <tr key={`schedule-${index}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{Day}</td>
                  <td className="px-4 py-2">{session.classType}</td>
                  <td className="px-4 py-2">
                    {session.timeStart} - {session.timeEnd || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-gray-400 cursor-not-allowed">
                      Not Removable
                    </span>
                  </td>
                </tr>
              ))}

              {/* Display the listed sessions (removable items) */}
              {listedSessions.map((session, index) => (
                <tr
                  key={`listed-${session.key}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{session.day || Day}</td>
                  <td className="px-4 py-2">{session.classType}</td>
                  <td className="px-4 py-2">
                    {session.timeStart} - {session.timeEnd || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRemove(session.key)}
                      className="text-red-500 text-lg hover:text-red-700"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            No schedule available for {Day}.
          </p>
        )}
      </div>

      {/* Price Summary Section */}
      {listedSessions.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Estimated Total Price Summary
          </h3>
          <div className="flex justify-between">
            <p className="text-gray-700">Total Price:</p>
            <p className="text-xl font-bold text-green-600">
              ${calculateTotalPrice().toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedTable;
