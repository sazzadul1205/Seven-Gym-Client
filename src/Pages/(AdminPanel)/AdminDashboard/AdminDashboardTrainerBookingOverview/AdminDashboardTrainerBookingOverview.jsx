// Import Packages
import PropTypes from "prop-types";

// React Icons
import {
  FaHourglassHalf,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
  FaDollarSign,
} from "react-icons/fa";

// StatCard component shows a card with a title, value, and an icon
const StatCard = ({ title, value, Icon }) => (
  <div
    className={`bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-300 shadow hover:shadow-2xl rounded-lg p-4 py-5 flex items-center gap-4 cursor-pointer`}
  >
    {/* Icon on the left */}
    <div className="text-3xl text-gray-600">
      <Icon />
    </div>
    {/* Title and value on the right */}
    <div>
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Define PropTypes for StatCard props
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  Icon: PropTypes.elementType.isRequired,
};

const AdminDashboardTrainerBookingOverview = ({
  TrainerBookingRequestStatusData,
  TrainerBookingAcceptedStatusData,
  TrainerBookingCompletedStatusData,
  TrainerBookingCancelledStatusData,
}) => {
  // Calculate total pending requests count
  const pendingCount = TrainerBookingRequestStatusData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  // Calculate total accepted bookings count
  const acceptedCount = TrainerBookingAcceptedStatusData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  // Calculate total completed bookings count
  const completedCount = TrainerBookingCompletedStatusData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  // Calculate total cancelled bookings count
  const cancelledCount = TrainerBookingCancelledStatusData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  // Calculate total completed sessions
  const completedSessions = TrainerBookingCompletedStatusData.reduce(
    (sum, item) => sum + (item.sessions || 0),
    0
  );

  // Calculate total cancelled sessions
  const cancelledSessions = TrainerBookingCancelledStatusData.reduce(
    (sum, item) => sum + (item.sessions || 0),
    0
  );

  // Calculate total refunded amount from cancelled bookings
  const refundedAmount = TrainerBookingCancelledStatusData.reduce(
    (sum, item) => sum + (item.refundedAmount || 0),
    0
  );

  return (
    <>
      {/* Header of the overview section */}
      <div className="relative bg-gray-400 px-4 py-3 text-white rounded-t flex items-center justify-center">
        <h3 className="text-lg font-semibold text-center">
          Trainer & Booking Overview
        </h3>
      </div>

      {/* Grid layout for main statistic cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 py-2">
        {/* Card for pending requests */}
        <StatCard
          title="Pending Requests"
          value={pendingCount}
          Icon={FaHourglassHalf}
        />
        {/* Card for accepted bookings */}
        <StatCard
          title="Accepted Bookings"
          value={acceptedCount}
          Icon={FaClipboardCheck}
        />
        {/* Card for completed bookings */}
        <StatCard
          title="Completed Bookings"
          value={completedCount}
          Icon={FaCheckCircle}
        />
        {/* Card for cancelled bookings */}
        <StatCard
          title="Cancelled Bookings"
          value={cancelledCount}
          Icon={FaTimesCircle}
        />
        {/* Card for completed sessions */}
        <StatCard
          title="Completed Sessions"
          value={completedSessions}
          Icon={FaRegCalendarCheck}
        />
        {/* Card for cancelled sessions */}
        <StatCard
          title="Cancelled Sessions"
          value={cancelledSessions}
          Icon={FaRegCalendarTimes}
        />
      </div>

      {/* Centered card for total refunded amount */}
      <div className="flex justify-center px-5">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <StatCard
            title="Total Refunded"
            value={`$${refundedAmount.toFixed(2)}`}
            Icon={FaDollarSign}
          />
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-xs text-gray-500 italic pt-4">
        * Trainer schedule snapshot feature coming soon
      </div>
    </>
  );
};

// Prop Validation
AdminDashboardTrainerBookingOverview.propTypes = {
  TrainerBookingRequestStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      sessions: PropTypes.number,
      totalPrice: PropTypes.number,
      date: PropTypes.string,
    })
  ).isRequired,
  TrainerBookingAcceptedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      sessions: PropTypes.number,
      totalPrice: PropTypes.number,
      acceptedDate: PropTypes.string,
    })
  ).isRequired,
  TrainerBookingCompletedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      sessions: PropTypes.number,
      totalPrice: PropTypes.number,
      endDate: PropTypes.string,
    })
  ).isRequired,
  TrainerBookingCancelledStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number,
      sessions: PropTypes.number,
      refundedAmount: PropTypes.number,
      droppedDate: PropTypes.string,
    })
  ).isRequired,
};

export default AdminDashboardTrainerBookingOverview;
