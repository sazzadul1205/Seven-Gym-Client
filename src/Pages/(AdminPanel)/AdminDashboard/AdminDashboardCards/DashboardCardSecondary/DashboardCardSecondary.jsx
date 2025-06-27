import { useState } from "react";
import { Card } from "../AdminDashboardCards";
import { FiCheckCircle, FiCreditCard, FiRefreshCcw } from "react-icons/fi";
import PropTypes from "prop-types";

const extractUniqueMonths = (...datasets) => {
  const monthsSet = new Set();

  datasets.forEach((data) => {
    data.forEach((item) => {
      // Find a date string property (common keys: "_id", "date")
      const dateStr = item.date || item._id;
      if (!dateStr) return;

      // Extract yyyy-mm (assumes dateStr starts with yyyy-mm-dd or yyyy-mm)
      const ym = dateStr.slice(0, 7);
      monthsSet.add(ym);
    });
  });

  // Convert Set to array and sort descending (latest first)
  return Array.from(monthsSet)
    .sort((a, b) => (a > b ? -1 : 1))
    .map((ym) => {
      const [year, month] = ym.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
      });
      return { value: ym, label: `${monthName} ${year}` };
    });
};

// Utility: calculate % difference and direction
const calculateChange = (current, previous) => {
  if (previous === 0) return { percent: 100, direction: "up" };
  if (current === previous) return { percent: 0, direction: "neutral" };
  const diff = current - previous;
  const percent = Math.abs((diff / previous) * 100);
  const direction = diff > 0 ? "up" : "down";
  return { percent: Math.round(percent), direction };
};

const DashboardCardSecondary = ({
  ClassBookingRefundStatusData,
  ClassBookingPaymentStatusData,
  ClassBookingCompletedStatusData,
}) => {
  // Dynamically generate months from all relevant datasets
  const MONTHS = extractUniqueMonths(
    ClassBookingRefundStatusData,
    ClassBookingPaymentStatusData,
    ClassBookingCompletedStatusData
  );

  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS.length > 0 ? MONTHS[0].value : ""
  );
  // Helpers
  const filterByMonth = (data, dateField = "_id") =>
    data.filter((item) => item[dateField].startsWith(selectedMonth));

  const getPreviousMonth = (month) => {
    const [year, mon] = month.split("-");
    let newYear = Number(year);
    let newMonth = Number(mon) - 1;
    if (newMonth === 0) {
      newMonth = 12;
      newYear -= 1;
    }
    return `${newYear}-${newMonth.toString().padStart(2, "0")}`;
  };

  // Filter current and previous month data
  const previousMonth = getPreviousMonth(selectedMonth);

  // Filter class payments for the current and previous month
  const filteredClassPayments = filterByMonth(
    ClassBookingPaymentStatusData,
    "date"
  );
  const filteredClassPaymentsPrev = ClassBookingPaymentStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
  );

  // Filter class refunds for the current and previous month
  const filteredClassRefunds = filterByMonth(
    ClassBookingRefundStatusData,
    "date"
  );
  const filteredClassRefundsPrev = ClassBookingRefundStatusData.filter((item) =>
    item.date.startsWith(previousMonth)
  );

  // Filter completed classes for the current and previous month
  const filteredClassCompleted = filterByMonth(
    ClassBookingCompletedStatusData,
    "date"
  );
  const filteredClassCompletedPrev = ClassBookingCompletedStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
  );

  // Helper functions to sum fields and counts
  const sumField = (arr, field) =>
    arr.reduce((acc, cur) => acc + (cur[field] || 0), 0);

  const sumCount = (arr) => arr.reduce((acc, cur) => acc + (cur.count || 0), 0);

  // Calculate totals for current and previous month
  const totalClassPayments = sumField(filteredClassPayments, "totalPrice");
  const totalClassPaymentsPrev = sumField(
    filteredClassPaymentsPrev,
    "totalPrice"
  );

  const totalClassRefunds = sumField(filteredClassRefunds, "refundAmount");
  const totalClassRefundsPrev = sumField(
    filteredClassRefundsPrev,
    "refundAmount"
  );

  const totalClassCompletedCount = sumCount(filteredClassCompleted);
  const totalClassCompletedPrevCount = sumCount(filteredClassCompletedPrev);

  // Calculate percentage change for dashboard display
  const classPaymentsChange = calculateChange(
    totalClassPayments,
    totalClassPaymentsPrev
  );
  const classRefundsChange = calculateChange(
    totalClassRefunds,
    totalClassRefundsPrev
  );

  const classCompletedChange = calculateChange(
    totalClassCompletedCount,
    totalClassCompletedPrevCount
  );

  return (
    <div className="pt-1 text-black">
      {/* Page Header */}
      <div className="relative bg-gray-400 px-4 py-3 text-white rounded-t flex items-center justify-center">
        {/* Centered Title */}
        <h3 className="text-lg font-semibold text-center">
          Class Management Overview
        </h3>

        {/* Month Selector aligned to right absolutely */}
        <div className="absolute right-4 flex items-center gap-2">
          <label htmlFor="month-select" className="text-sm font-medium">
            Month:
          </label>
          <select
            id="month-select"
            className="text-black bg-white px-3 py-1 rounded shadow-sm focus:outline-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {MONTHS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-5 py-2">
        <Card
          icon={FiCreditCard}
          title="Class Booking Payments"
          value={totalClassPayments}
          currency
          change={classPaymentsChange}
        />

        <Card
          icon={FiRefreshCcw}
          title="Class Booking Refunds"
          value={totalClassRefunds}
          currency
          change={classRefundsChange}
        />
        <Card
          icon={FiCheckCircle}
          title="Class Bookings Completed"
          value={totalClassCompletedCount}
          change={classCompletedChange}
        />
      </div>
    </div>
  );
};

// Prop Validation
DashboardCardSecondary.propTypes = {
  ClassBookingRefundStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      refundAmount: PropTypes.number,
    })
  ).isRequired,
  ClassBookingPaymentStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalPrice: PropTypes.number,
    })
  ).isRequired,
  ClassBookingCompletedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
};

export default DashboardCardSecondary;
