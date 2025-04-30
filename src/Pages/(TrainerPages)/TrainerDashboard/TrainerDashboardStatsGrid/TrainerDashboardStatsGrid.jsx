import PropTypes from "prop-types";

// Reusable StatCard component to display a single statistic
const StatCard = ({ title, value, color }) => (
  <div className="bg-gradient-to-br hover:bg-gradient-to-tl from-gray-100 to-gray-400 border border-gray-400 hover:border-gray-600 shadow-md hover:shadow-2xl rounded-2xl py-6 px-4 text-center transition-all duration-300 ease-in-out cursor-default">
    {/* Title */}
    <h4 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
      {title}
    </h4>

    {/* Decorative divider */}
    <div className="mx-auto w-1/2 h-1 bg-gray-400 rounded-full mb-2" />

    {/* Value with dynamic text color */}
    <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

// Prop types for StatCard to enforce proper prop usage
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

// Main statistics grid component for displaying trainer dashboard metrics
const TrainerDashboardStatsGrid = ({
  TrainerBookingAccepted,
  TrainerBookingHistory,
}) => {
  // Calculate total earnings: sum of accepted bookings and refunded amounts from history
  const totalEarnings = (
    TrainerBookingAccepted.reduce(
      (acc, booking) => acc + parseFloat(booking.totalPrice || 0),
      0
    ) +
    TrainerBookingHistory.reduce(
      (acc, history) => acc + (parseFloat(history.RefundAmount) || 0),
      0
    )
  ).toFixed(2); // Fixed to 2 decimal places

  // Calculate total current bookings
  const totalBookings = TrainerBookingAccepted.length;

  // Calculate total pending sessions
  const totalSessions = TrainerBookingAccepted.reduce(
    (acc, booking) => acc + booking.sessions.length,
    0
  );

  // Calculate total refunded amount from booking history
  const totalRefundedAmount = TrainerBookingHistory.reduce(
    (acc, history) => acc + (parseFloat(history.RefundAmount) || 0),
    0
  ).toFixed(2);

  // Calculate total earnings from completed bookings (status "Ended")
  const totalEarnedFromEnded = TrainerBookingHistory.filter(
    (history) => history.status === "Ended"
  )
    .reduce((acc, history) => acc + parseFloat(history.totalPrice || 0), 0)
    .toFixed(2);

  return (
    <div className="px-0 md:px-4 py-1 md:py-6">
      {/* Grid layout: 1 column for mobile, 2 for small screens, 3 for large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-6">
        {/* Each StatCard renders a different metric */}
        <StatCard
          title="Total Current Bookings"
          value={totalBookings}
          color="text-blue-600"
        />
        <StatCard
          title="Total Pending Sessions"
          value={totalSessions}
          color="text-purple-600"
        />
        <StatCard title="Status" value="Active" color="text-gray-800" />
        <StatCard
          title="Total Esteemed Earnings"
          value={`$ ${totalEarnings}`}
          color="text-yellow-600"
        />
        <StatCard
          title="Refunded Amount"
          value={`$ ${totalRefundedAmount}`}
          color="text-red-600"
        />
        <StatCard
          title="Total Earned (Completed)"
          value={`$ ${totalEarnedFromEnded}`}
          color="text-green-600"
        />
      </div>
    </div>
  );
};

// Prop types to ensure correct data format for incoming props
TrainerDashboardStatsGrid.propTypes = {
  TrainerBookingAccepted: PropTypes.arrayOf(
    PropTypes.shape({
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessions: PropTypes.array.isRequired,
    })
  ).isRequired,
  TrainerBookingHistory: PropTypes.arrayOf(
    PropTypes.shape({
      RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default TrainerDashboardStatsGrid;
