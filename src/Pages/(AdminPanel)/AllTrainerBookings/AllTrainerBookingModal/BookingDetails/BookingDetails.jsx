import { formatDate } from "../../../../../Utility/formatDate";
import PropTypes from "prop-types";

const formatDateToMonthDayYear = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  const options = { month: "long", day: "2-digit", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const BookingDetails = ({ booking }) => {
  if (!booking) return null;

  const displayItems = [
    {
      label: "Duration (Weeks)",
      value:
        booking.durationWeeks === 1
          ? "1 Week"
          : `${booking.durationWeeks} Weeks`,
      condition: booking.durationWeeks,
    },
    {
      label: "Total Price",
      value: booking.totalPrice === "free" ? "Free" : `$ ${booking.totalPrice}`,
      condition: booking.totalPrice,
    },
    {
      label: "Status",
      value: booking.status,
      condition: booking.status,
    },
    {
      label: "Booked At",
      value: formatDate ? formatDate(booking.bookedAt) : booking.bookedAt,
      condition: booking.bookedAt,
    },
    {
      label: "Start At",
      value: booking.startAt
        ? formatDateToMonthDayYear(booking.startAt)
        : booking.startAt,
      condition: booking.startAt,
    },
    {
      label: "Accepted At",
      value: formatDate ? formatDate(booking.acceptedAt) : booking.acceptedAt,
      condition: booking.acceptedAt,
    },
    {
      label: "Paid At",
      value: booking.paidAt
        ? formatDateToMonthDayYear(booking.paidAt)
        : booking.paidAt,
      condition: booking.paidAt,
    },
    {
      label: "Doped At",
      value: booking.droppedAt
        ? formatDateToMonthDayYear(booking.droppedAt)
        : booking.droppedAt,
      condition: booking.droppedAt,
    },
    {
      label: "Logged Time",
      value: booking.loggedTime,
      condition: booking.loggedTime,
    },
    {
      label: "paid",
      value: booking.paid === true ? "True" : "False",
      condition: booking.paid !== undefined && booking.paid !== null,
    },
    {
      label: "Booking ID",
      value: booking._id,
      condition: booking._id,
    },
    {
      label: "Payment ID",
      value: booking.paymentID,
      condition: booking.paymentID,
    },
    {
      label: "Refund Amount",
      value:
        typeof booking.RefundAmount === "number"
          ? `$ ${booking.RefundAmount.toFixed(2)}`
          : booking.RefundAmount,
      condition:
        booking.RefundAmount !== undefined && booking.RefundAmount !== null,
    },

    {
      label: "Refund Percentage (%)",
      value: booking.RefundPercentage,
      condition: booking.RefundPercentage,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-200 border-t-4 border-white">
      {displayItems.map(
        (item, index) =>
          item.condition && (
            <div key={index} className="flex justify-between">
              <strong>{item.label}:</strong>
              <span>{item.value}</span>
            </div>
          )
      )}
    </div>
  );
};

// Prop Validation
BookingDetails.propTypes = {
  booking: PropTypes.shape({
    durationWeeks: PropTypes.number,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    bookedAt: PropTypes.string,
    startAt: PropTypes.string,
    acceptedAt: PropTypes.string,
    paidAt: PropTypes.string,
    droppedAt: PropTypes.string,
    loggedTime: PropTypes.string,
    paid: PropTypes.bool,
    _id: PropTypes.string,
    paymentID: PropTypes.string,
    RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    RefundPercentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default BookingDetails;
