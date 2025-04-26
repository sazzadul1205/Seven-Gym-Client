/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

const TrainerDashboard = ({
  TrainerBookingHistoryDailyStats,
  TrainerBookingAcceptedDailyStats,
  TrainerBookingAccepted,
  TrainerBookingHistory,
}) => {
  // Total earnings (Accepted Bookings + Refunds from History)
  const totalEarnings = (
    TrainerBookingAccepted.reduce((acc, booking) => {
      return acc + parseFloat(booking.totalPrice);
    }, 0) +
    TrainerBookingHistory.reduce((acc, history) => {
      return acc + (parseFloat(history.RefundAmount) || 0);
    }, 0)
  ).toFixed(2);

  // Total bookings
  const totalBookings = TrainerBookingAccepted.length;

  // Total sessions
  const totalSessions = TrainerBookingAccepted.reduce((acc, booking) => {
    return acc + booking.sessions.length;
  }, 0);

  // Trainer name
  const trainerName = TrainerBookingAccepted[0]?.trainer || "N/A";

  // Total refunded amount
  const totalRefundedAmount = TrainerBookingHistory.reduce((acc, history) => {
    return acc + (parseFloat(history.RefundAmount) || 0);
  }, 0).toFixed(2);

  // TOTAL EARNED (only from Ended bookings)
  const totalEarnedFromEnded = TrainerBookingHistory.filter(
    (history) => history.status === "Ended"
  )
    .reduce((acc, history) => {
      return acc + parseFloat(history.totalPrice || 0);
    }, 0)
    .toFixed(2);

  console.log("Trainer Booking Accepted -> :", TrainerBookingAccepted);

  console.log(
    "Trainer Booking History Daily Stats :",
    TrainerBookingHistoryDailyStats
  );
  
  console.log(
    "Trainer Booking Accepted Daily Stats :",
    TrainerBookingAcceptedDailyStats
  );

  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-300 min-h-screen p-4">
      {/* Title */}
      <h3 className="text-2xl text-center font-bold text-black mb-2">
        {trainerName}&apos;s Dashboard
      </h3>

      {/* Divider */}
      <div className="w-1/3 mx-auto p-[1px] bg-black mb-4" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Current Bookings */}
        <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 border border-gray-500 shadow md:shadow-2xl rounded-2xl py-6 text-center cursor-default">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Current Bookings
          </h4>

          <div className="mx-auto w-1/2 bg-black p-[1px] my-2" />
          <p className="text-xl font-bold text-blue-600">{totalBookings}</p>
        </div>

        {/* Total Pending Sessions */}
        <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 border border-gray-500 shadow md:shadow-2xl rounded-2xl py-6 text-center cursor-default">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Pending Sessions
          </h4>

          <div className="mx-auto w-1/2 bg-black p-[1px] my-2" />
          <p className="text-xl font-bold text-purple-600">{totalSessions}</p>
        </div>

        {/* Status */}
        <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 border border-gray-500 shadow md:shadow-2xl rounded-2xl py-6 text-center cursor-default">
          <h4 className="text-lg font-semibold text-gray-700">Status</h4>

          <div className="mx-auto w-1/2 bg-black p-[1px] my-2" />
          <p className="text-xl font-bold text-gray-800">Active</p>
        </div>

        {/* Total Esteemed Earnings */}
        <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 border border-gray-500 shadow md:shadow-2xl rounded-2xl py-6 text-center cursor-default">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Esteemed Earnings
          </h4>

          <div className="mx-auto w-1/2 bg-black p-[1px] my-2" />
          <p className="text-xl font-bold text-yellow-600">$ {totalEarnings}</p>
        </div>

        {/* Refunded Amount */}
        <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 border border-gray-500 shadow md:shadow-2xl rounded-2xl py-6 text-center cursor-default">
          <h4 className="text-lg font-semibold text-gray-700">
            Refunded Amount
          </h4>

          <div className="mx-auto w-1/2 bg-black p-[1px] my-2" />
          <p className="text-xl font-bold text-red-600">
            $ {totalRefundedAmount}
          </p>
        </div>

        {/* Total Earned (Completed) */}
        <div className="bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 border border-gray-500 shadow md:shadow-2xl rounded-2xl py-6 text-center cursor-default">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Earned (Completed)
          </h4>

          <div className="mx-auto w-1/2 bg-black p-[1px] my-2" />
          <p className="text-xl font-bold text-green-600">
            $ {totalEarnedFromEnded}
          </p>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
TrainerDashboard.propTypes = {
  TrainerBookingAccepted: PropTypes.arrayOf(
    PropTypes.shape({
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
      trainer: PropTypes.string.isRequired,
    })
  ).isRequired,

  TrainerBookingHistory: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default TrainerDashboard;
