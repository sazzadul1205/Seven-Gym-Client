import PropTypes from "prop-types";
import {
  FiCheckCircle,
  FiXCircle,
  FiSend,
  FiCreditCard,
  FiRefreshCcw,
  FiCheckSquare,
} from "react-icons/fi";

// Reusable Stat Card with Icon
const StatCard = ({ title, value, subtitle = "", Icon }) => (
  <div className="bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-300 rounded-xl shadow hover:shadow-xl p-5 text-center flex flex-col items-center gap-2 relative cursor-default">
    {/* ICons */}
    <div className="p-3 bg-white rounded-full shadow-sm">
      <Icon className="text-2xl text-gray-700" />
    </div>

    {/* Data */}
    <div>
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-700 mt-1">{subtitle}</p>}
    </div>
  </div>
);

// Prop Validation
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  Icon: PropTypes.elementType.isRequired,
};

const DashboardCardPrimary = ({
  ClassBookingRequestData,
  ClassBookingAcceptedData,
  ClassBookingRejectedData,
  ClassBookingCompletedData,
  ClassBookingRefundStatusData,
  ClassBookingPaymentStatusData,
  ClassBookingCompletedStatusData,
}) => {
  // Helpers

  // Sums a specific field in an array of objects
  const sumField = (arr, field) =>
    arr.reduce((acc, cur) => acc + (cur[field] || 0), 0);

  // Count of booking requests
  const requestCount = ClassBookingRequestData.length;
  // Count of accepted bookings
  const acceptedCount = ClassBookingAcceptedData.length;
  // Count of rejected bookings
  const rejectedCount = ClassBookingRejectedData.length;
  // Count of completed bookings (raw)
  const completedCountRaw = ClassBookingCompletedData.length;

  // Payment stats
  const paymentCount = sumField(ClassBookingPaymentStatusData, "count");
  const paymentTotal = sumField(ClassBookingPaymentStatusData, "totalPrice");

  // Refund stats
  const refundCount = sumField(ClassBookingRefundStatusData, "count");
  const refundTotal = sumField(ClassBookingRefundStatusData, "refundAmount");

  // Completed stats
  const completedCount = sumField(ClassBookingCompletedStatusData, "count");
  const completedTotal = sumField(
    ClassBookingCompletedStatusData,
    "totalPrice"
  );

  // Today's date in a readable format
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 text-black">
      {/* Header */}
      <div className="flex md:block items-center md:mx-auto md:text-center space-y-1 py-4 px-2">
        {/* Title Cars */}
        <div>
          {/* Title */}
          <h3 className="text-xl md:text-2xl sm:text-3xl font-bold text-gray-800">
            Class Booking Dashboard
          </h3>

          {/* Sub Title */}
          <p className="text-black text-sm mx-auto md:text-base mt-1">
            {today}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px] mb-3" />

      {/* Booking Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
        <StatCard
          title="Booking Requests"
          value={requestCount}
          color="bg-yellow-100"
          Icon={FiSend}
        />
        <StatCard
          title="Accepted Bookings"
          value={acceptedCount}
          color="bg-green-100"
          Icon={FiCheckCircle}
        />
        <StatCard
          title="Rejected Bookings"
          value={rejectedCount}
          color="bg-red-100"
          Icon={FiXCircle}
        />
        <StatCard
          title="Completed Bookings"
          value={completedCountRaw}
          color="bg-blue-100"
          Icon={FiCheckSquare}
        />
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
        <StatCard
          title="Total Payments"
          value={`$${paymentTotal.toFixed(2)}`}
          subtitle={`Across ${paymentCount} payments`}
          color="bg-green-200"
          Icon={FiCreditCard}
        />
        <StatCard
          title="Total Refunds"
          value={`$${refundTotal.toFixed(2)}`}
          subtitle={`Across ${refundCount} refunds`}
          color="bg-red-200"
          Icon={FiRefreshCcw}
        />
        <StatCard
          title="Total Completed"
          value={`$${completedTotal.toFixed(2)}`}
          subtitle={`Across ${completedCount} completions`}
          color="bg-blue-200"
          Icon={FiCheckCircle}
        />
      </div>
    </div>
  );
};

// Prop Validation
DashboardCardPrimary.propTypes = {
  ClassBookingRequestData: PropTypes.array.isRequired,
  ClassBookingAcceptedData: PropTypes.array.isRequired,
  ClassBookingRejectedData: PropTypes.array.isRequired,
  ClassBookingCompletedData: PropTypes.array.isRequired,
  ClassBookingRefundStatusData: PropTypes.array.isRequired,
  ClassBookingPaymentStatusData: PropTypes.array.isRequired,
  ClassBookingCompletedStatusData: PropTypes.array.isRequired,
};

export default DashboardCardPrimary;
