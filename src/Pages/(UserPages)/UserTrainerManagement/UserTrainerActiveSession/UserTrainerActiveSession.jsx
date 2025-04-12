import { formatTimeTo12Hour } from "../../../../Utility/formatTimeTo12Hour";

const UserTrainerActiveSession = ({ TrainersBookingAcceptedData }) => {
  // Step 1: Normalize sessions
  const normalizedSessions = TrainersBookingAcceptedData?.flatMap((booking) =>
    booking.sessions.map((s) => {
      const [trainer, day, time] = s.split("-");
      return {
        trainer,
        day,
        start: time,
        end: add59Minutes(time), // assuming 30-minute sessions
        classType: "Personal Training", // You can replace this with dynamic type if available
        classPrice: booking.totalPrice,
      };
    })
  );

  // Step 2: Group sessions by day
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sessionsByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = normalizedSessions?.filter((s) => s.day === day) || [];
    return acc;
  }, {});

  console.log(TrainersBookingAcceptedData);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center pt-5 pb-2">
        <h3 className="text-xl font-semibold">My Active Sessions</h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Weekly Session Section */}
      <div className="mt-2 p-2">
        {/* Section Title */}
        <h3 className="text-lg font-semibold text-center mb-4">
          Weekly Session Table
        </h3>

        {/* Desktop Table (visible on md and up) */}
        <div className="overflow-x-auto hidden md:block">
          <table className="table-auto border-collapse w-full text-sm text-center text-black shadow-md">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#A1662F] text-white">
                {daysOfWeek.map((day) => (
                  <th key={day} className="px-4 py-2 border border-gray-800">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              <tr>
                {daysOfWeek.map((day) => (
                  <td
                    key={day}
                    className="min-w-[120px] h-[100px] align-middle justify-center items-center border border-[#A1662F] text-center"
                  >
                    {/* If sessions exist for the day */}
                    {sessionsByDay[day].length > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        {sessionsByDay[day].map((s, idx) => (
                          <div
                            key={idx}
                            className="w-full border-t border-[#A1662F] overflow-hidden"
                          >
                            <div className="px-3 py-5 hover:bg-green-200 transition-colors text-center cursor-pointer">
                              <p className="text-sm font-semibold text-[#333]">
                                {s.trainer}
                              </p>
                              <p className="text-xs text-gray-700">
                                {formatTimeTo12Hour(s.start)} –{" "}
                                {formatTimeTo12Hour(s.end)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // No sessions message
                      <div className="flex justify-center items-center h-full py-6">
                        <p className="text-red-500 font-bold italic">
                          No sessions
                        </p>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View (visible on small screens only) */}
        <div className="flex flex-col space-y-4 md:hidden">
          {daysOfWeek.map((day) => (
            <div key={day} className="border p-3 rounded-md shadow-sm">
              <h4 className="text-md font-semibold text-center mb-2">{day}</h4>
              {sessionsByDay[day].length > 0 ? (
                sessionsByDay[day].map((s, idx) => (
                  <div key={idx} className="border-t border-[#A1662F] py-3">
                    <p className="text-sm font-semibold text-[#333]">
                      {s.trainer}
                    </p>
                    <p className="text-xs text-gray-700">
                      {formatTimeTo12Hour(s.start)} –{" "}
                      {formatTimeTo12Hour(s.end)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center py-6">
                  <p className="text-red-500 font-bold italic">No sessions</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 p-2">
        {/* Section Title */}
        <h3 className="text-lg font-semibold text-center mb-4">
          Attending Trainer Table
        </h3>

        {/* Desktop Table (visible on md and up) */}
        <div className="overflow-x-auto hidden md:block">
          <table className="table-auto border-collapse w-full text-sm text-center text-black shadow-md">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#A1662F] text-white">
                <th className="px-4 py-2 text-left">Trainer</th>
                <th className="px-4 py-2 text-left">Booked At</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-left">Session End</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {TrainersBookingAcceptedData.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-100 ">
                  {/* Trainer Name */}
                  <td className="px-4 py-2 text-left">{booking.trainer}</td>

                  {/* Booked At Date */}
                  <td className="px-4 py-2 text-left">{booking.bookedAt}</td>

                  {/* Total Price */}
                  <td className="px-4 py-2 text-left">${booking.totalPrice}</td>

                  {/* Duration in Weeks */}
                  <td className="px-4 py-2 text-left">
                    {booking.durationWeeks}{" "}
                    {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                  </td>

                  {/* Session End (using acceptedAt as a placeholder) */}
                  <td className="px-4 py-2 text-left">{booking.acceptedAt}</td>

                  {/* Action Button */}
                  <td className="px-4 py-2 text-left">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTrainerActiveSession;

// Utility to add 30 mins to HH:MM
const add59Minutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + 59);
  return date.toTimeString().slice(0, 5);
};
