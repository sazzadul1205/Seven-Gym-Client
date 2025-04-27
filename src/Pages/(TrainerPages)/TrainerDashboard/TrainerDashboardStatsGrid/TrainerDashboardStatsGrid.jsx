import PropTypes from "prop-types";

// Reusable StatCard component for displaying a single statistic
const StatCard = ({ title, value, color }) => (
  <div className="bg-gradient-to-br hover:bg-gradient-to-tl from-gray-100 to-gray-400 border border-gray-400 hover:border-gray-600 shadow-md hover:shadow-2xl rounded-2xl py-8 px-4 text-center transition-all duration-300 ease-in-out cursor-default">
    <h4 className="text-xl font-semibold text-gray-700 mb-2">{title}</h4>
    <div className="mx-auto w-1/2 h-1 bg-gray-400 rounded-full" />
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

// Prop types for StatCard to ensure correct props are passed
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

// Main Grid Component for the Trainer Dashboard Statistics
const TrainerDashboardStatsGrid = ({
  TrainerBookingAccepted,
  TrainerBookingHistory,
}) => {
  // Calculate total earnings (Sum of current accepted booking prices + any refund amounts from booking history)
  const totalEarnings = (
    TrainerBookingAccepted.reduce(
      (acc, booking) => acc + parseFloat(booking.totalPrice || 0),
      0
    ) +
    TrainerBookingHistory.reduce(
      (acc, history) => acc + (parseFloat(history.RefundAmount) || 0),
      0
    )
  ).toFixed(2);

  // Total number of current active bookings
  const totalBookings = TrainerBookingAccepted.length;

  // Total number of pending sessions across all bookings
  const totalSessions = TrainerBookingAccepted.reduce(
    (acc, booking) => acc + booking.sessions.length,
    0
  );

  // Total amount refunded from all booking histories
  const totalRefundedAmount = TrainerBookingHistory.reduce(
    (acc, history) => acc + (parseFloat(history.RefundAmount) || 0),
    0
  ).toFixed(2);

  // Total amount earned from bookings that have status "Ended"
  const totalEarnedFromEnded = TrainerBookingHistory.filter(
    (history) => history.status === "Ended"
  )
    .reduce((acc, history) => acc + parseFloat(history.totalPrice || 0), 0)
    .toFixed(2);

  return (
    // Grid Layout: 1 column on small, 2 columns on medium, 3 columns on large screens
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Each StatCard displays one metric */}
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
  );
};

// Prop types for TrainerDashboardStatsGrid to enforce data structure
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
