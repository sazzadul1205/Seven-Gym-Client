/* eslint-disable react/prop-types */

const BookedTable = ({
  SameTimeData,
  Day,
  clickedSessions,
  setClickedSessions,
}) => {
  // Get the schedule for the selected day
  const daySchedule = SameTimeData?.schedule?.[Day] || [];

  // Combine clickedSessions with the day's schedule
  const combinedSchedule = [...daySchedule, ...clickedSessions];

  // Function to handle removing a clicked session
  const handleRemove = (sessionKey) => {
    setClickedSessions((prev) =>
      prev.filter((session) => session.key !== sessionKey)
    );
  };

  return (
    <div className="p-4 bg-white max-w-7xl mx-auto my-5 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Bookings List</h2>
      {combinedSchedule.length > 0 ? (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Day</th>
              <th className="px-4 py-2 text-left">Class Type</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {combinedSchedule.map((session, index) => {
              // Check if the session is from the clickedSessions
              const isRemovable = !daySchedule.some(
                (originalSession) =>
                  originalSession.timeStart === session.timeStart &&
                  originalSession.timeEnd === session.timeEnd &&
                  originalSession.classType === session.classType
              );

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{session.day || Day}</td>
                  <td className="px-4 py-2">{session.classType}</td>
                  <td className="px-4 py-2">
                    {session.timeStart} - {session.timeEnd || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {isRemovable ? (
                      <button
                        onClick={() => handleRemove(session.key)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-gray-400 cursor-not-allowed">
                        Not Removable
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">
          No schedule or clicked sessions available for {Day}.
        </p>
      )}
    </div>
  );
};

export default BookedTable;
