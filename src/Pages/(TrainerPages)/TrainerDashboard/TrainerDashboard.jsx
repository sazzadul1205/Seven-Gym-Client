const TrainerDashboard = ({
  TrainerBookingAccepted = [],
  TrainerBookingHistory = [],
}) => {
  // Total earnings (2 decimal places)
  const totalEarnings = TrainerBookingAccepted.reduce((acc, booking) => {
    return acc + parseFloat(booking.totalPrice);
  }, 0).toFixed(2);

  // Total bookings
  const totalBookings = TrainerBookingAccepted.length;

  // Total sessions
  const totalSessions = TrainerBookingAccepted.reduce((acc, booking) => {
    return acc + booking.sessions.length;
  }, 0);

  // Trainer name (assumes same trainer)
  const trainerName = TrainerBookingAccepted[0]?.trainer || "N/A";

  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-300 min-h-screen p-4">
      {/* Title */}
      <h3 className="text-2xl text-center font-bold text-black mb-2">
        {trainerName}&apos;s Dashboard
      </h3>

      {/* Divider */}
      <div className="w-1/3 mx-auto p-[1px] bg-black mb-4" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Earnings
          </h4>
          <p className="text-xl font-bold text-green-600">৳ {totalEarnings}</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Bookings
          </h4>
          <p className="text-xl font-bold text-blue-600">{totalBookings}</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Sessions
          </h4>
          <p className="text-xl font-bold text-purple-600">{totalSessions}</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-4 text-center">
          <h4 className="text-lg font-semibold text-gray-700">Status</h4>
          <p className="text-xl font-bold text-gray-800">Active</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
