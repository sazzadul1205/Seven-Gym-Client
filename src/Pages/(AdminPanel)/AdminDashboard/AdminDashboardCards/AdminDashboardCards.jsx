import PropTypes from "prop-types";
import { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCreditCard,
  FiRefreshCcw,
  FiCheckCircle,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

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

const AdminDashboardCards = ({
  AllUsersData,
  AllTrainersData,
  DailyTierUpgradeRefundData,
  DailyTierUpgradePaymentData,
  ClassBookingRefundStatusData,
  ClassBookingPaymentStatusData,
  TrainerSessionRefundStatusData,
  TrainerSessionActiveStatusData,
  TrainerSessionPaymentStatusData,
  TrainerSessionCompletedStatusData,
}) => {
  // Dynamically generate months from all relevant datasets
  const MONTHS = extractUniqueMonths(
    TrainerSessionRefundStatusData,
    TrainerSessionActiveStatusData,
    TrainerSessionPaymentStatusData,
    TrainerSessionCompletedStatusData,
    DailyTierUpgradePaymentData,
    DailyTierUpgradeRefundData,
    ClassBookingRefundStatusData,
    ClassBookingPaymentStatusData
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

  const filteredTierPayments = filterByMonth(DailyTierUpgradePaymentData);
  const filteredTierPaymentsPrev = DailyTierUpgradePaymentData.filter((item) =>
    item._id.startsWith(previousMonth)
  );

  const filteredTierRefunds = filterByMonth(DailyTierUpgradeRefundData);
  const filteredTierRefundsPrev = DailyTierUpgradeRefundData.filter((item) =>
    item._id.startsWith(previousMonth)
  );

  const filteredTrainerPayments = filterByMonth(
    TrainerSessionPaymentStatusData,
    "date"
  );
  const filteredTrainerPaymentsPrev = TrainerSessionPaymentStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
  );

  const filteredTrainerRefunds = filterByMonth(
    TrainerSessionRefundStatusData,
    "date"
  );
  const filteredTrainerRefundsPrev = TrainerSessionRefundStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
  );

  const filteredTrainerCompleted = filterByMonth(
    TrainerSessionCompletedStatusData,
    "date"
  );
  const filteredTrainerCompletedPrev = TrainerSessionCompletedStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
  );

  const filteredTrainerActive = filterByMonth(
    TrainerSessionActiveStatusData,
    "date"
  );
  const filteredTrainerActivePrev = TrainerSessionActiveStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
  );

  const filteredClassPayments = filterByMonth(
    ClassBookingPaymentStatusData,
    "date"
  );
  const filteredClassPaymentsPrev = ClassBookingPaymentStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
  );

  const filteredClassRefunds = filterByMonth(
    ClassBookingRefundStatusData,
    "date"
  );
  const filteredClassRefundsPrev = ClassBookingRefundStatusData.filter((item) =>
    item.date.startsWith(previousMonth)
  );

  // Sum helpers
  const sumField = (arr, field) =>
    arr.reduce((acc, cur) => acc + (cur[field] || 0), 0);

  const sumCount = (arr) => arr.reduce((acc, cur) => acc + (cur.count || 0), 0);

  // Calculate totals for current and previous months
  const totalTierPayments = sumField(filteredTierPayments, "totalRevenue");
  const totalTierPaymentsPrev = sumField(
    filteredTierPaymentsPrev,
    "totalRevenue"
  );

  const totalTierRefunds = sumField(filteredTierRefunds, "totalRefunded");
  const totalTierRefundsPrev = sumField(
    filteredTierRefundsPrev,
    "totalRefunded"
  );

  const totalTrainerPayments = sumField(filteredTrainerPayments, "totalPaid");
  const totalTrainerPaymentsPrev = sumField(
    filteredTrainerPaymentsPrev,
    "totalPaid"
  );

  const totalTrainerRefunds = sumField(filteredTrainerRefunds, "totalRefunded");
  const totalTrainerRefundsPrev = sumField(
    filteredTrainerRefundsPrev,
    "totalRefunded"
  );

  const totalTrainerSessionsCompleted = sumCount(filteredTrainerCompleted);
  const totalTrainerSessionsCompletedPrev = sumCount(
    filteredTrainerCompletedPrev
  );

  // NEW: Active sessions sums
  const totalTrainerActiveSessions = sumCount(filteredTrainerActive);
  const totalTrainerActivePayments = sumField(
    filteredTrainerActive,
    "totalPaid"
  );

  const totalTrainerActiveSessionsPrev = sumCount(filteredTrainerActivePrev);
  const totalTrainerActivePaymentsPrev = sumField(
    filteredTrainerActivePrev,
    "totalPaid"
  );

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

  // For users and trainers, just simple difference - no dates
  const usersCount = AllUsersData.length;
  const trainersCount = AllTrainersData.length;

  // Calculate changes
  const tierPaymentsChange = calculateChange(
    totalTierPayments,
    totalTierPaymentsPrev
  );

  const tierRefundsChange = calculateChange(
    totalTierRefunds,
    totalTierRefundsPrev
  );

  const trainerPaymentsChange = calculateChange(
    totalTrainerPayments,
    totalTrainerPaymentsPrev
  );

  const trainerRefundsChange = calculateChange(
    totalTrainerRefunds,
    totalTrainerRefundsPrev
  );

  const sessionsCompletedChange = calculateChange(
    totalTrainerSessionsCompleted,
    totalTrainerSessionsCompletedPrev
  );

  const activeSessionsChange = calculateChange(
    totalTrainerActiveSessions,
    totalTrainerActiveSessionsPrev
  );

  const activePaymentsChange = calculateChange(
    totalTrainerActivePayments,
    totalTrainerActivePaymentsPrev
  );

  const classPaymentsChange = calculateChange(
    totalClassPayments,
    totalClassPaymentsPrev
  );
  const classRefundsChange = calculateChange(
    totalClassRefunds,
    totalClassRefundsPrev
  );

  return (
    <div className="pt-1">
      {/* Page Header */}
      <div className="relative bg-gray-400 px-4 py-3 text-white rounded-t flex items-center justify-center">
        {/* Centered Title */}
        <h3 className="text-lg font-semibold text-center">Admin Overview</h3>

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
          icon={FiUsers}
          title="Total Users"
          value={usersCount}
          change={{ direction: "neutral", percent: 0 }}
        />
        <Card
          icon={FiUserCheck}
          title="Total Trainers"
          value={trainersCount}
          change={{ direction: "neutral", percent: 0 }}
        />
        <Card
          icon={FiCreditCard}
          title="Tier Upgrade Payments"
          value={totalTierPayments}
          currency
          change={tierPaymentsChange}
        />
        <Card
          icon={FiRefreshCcw}
          title="Tier Upgrade Refunds"
          value={totalTierRefunds}
          currency
          change={tierRefundsChange}
        />
        <Card
          icon={FiCreditCard}
          title="Trainer Session Payments"
          value={totalTrainerPayments}
          currency
          change={trainerPaymentsChange}
        />
        <Card
          icon={FiRefreshCcw}
          title="Trainer Session Refunds"
          value={totalTrainerRefunds}
          currency
          change={trainerRefundsChange}
        />
        <Card
          icon={FiCheckCircle}
          title="Trainer Sessions Completed"
          value={totalTrainerSessionsCompleted}
          change={sessionsCompletedChange}
        />
        <Card
          icon={FiUsers}
          title="Active Trainer Sessions"
          value={totalTrainerActiveSessions}
          change={activeSessionsChange}
        />
        <Card
          icon={FiCreditCard}
          title="Active Sessions Payments"
          value={totalTrainerActivePayments}
          currency
          change={activePaymentsChange}
        />
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
      </div>
    </div>
  );
};

// Prop Validation
AdminDashboardCards.propTypes = {
  AllUsersData: PropTypes.arrayOf(PropTypes.object).isRequired,
  AllTrainersData: PropTypes.arrayOf(PropTypes.object).isRequired,
  DailyTierUpgradeRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      totalRefunded: PropTypes.number.isRequired,
    })
  ).isRequired,
  DailyTierUpgradePaymentData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      totalRevenue: PropTypes.number.isRequired,
    })
  ).isRequired,
  TrainerSessionRefundStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalRefunded: PropTypes.number.isRequired,
    })
  ).isRequired,
  TrainerSessionActiveStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      totalPaid: PropTypes.number.isRequired,
    })
  ).isRequired,
  TrainerSessionPaymentStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalPaid: PropTypes.number.isRequired,
    })
  ).isRequired,
  TrainerSessionCompletedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
  ClassBookingRefundStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      refundAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
  ClassBookingPaymentStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default AdminDashboardCards;

// Card component with comparison arrow
const Card = ({ icon: Icon, title, value, currency = false, change }) => {
  const isUp = change.direction === "up";
  const isDown = change.direction === "down";

  return (
    <div className="bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-200 rounded-xl shadow hover:shadow-xl p-5 text-center flex flex-col items-center gap-2 relative cursor-default">
      <Icon className="text-blue-600 text-3xl" />
      <h3 className="text-gray-600 font-semibold">{title}</h3>
      <p className="text-3xl font-bold flex items-center gap-2 justify-center">
        {currency && "$ "}
        {typeof value === "number"
          ? currency
            ? value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : value.toLocaleString()
          : value}
        {isUp && (
          <FiArrowUp
            className="text-green-500 font-bold text-xl"
            title="Increased"
          />
        )}
        {isDown && (
          <FiArrowDown
            className="text-red-500 font-bold text-xl"
            title="Decreased"
          />
        )}
      </p>
      {(isUp || isDown) && (
        <small
          className={`${
            isUp ? "text-green-600" : "text-red-600"
          } absolute bottom-2 right-3 text-xs`}
        >
          {change.percent}% {isUp ? "up" : "down"} vs last month
        </small>
      )}
    </div>
  );
};

// Prop Validation
Card.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currency: PropTypes.bool,
  change: PropTypes.shape({
    direction: PropTypes.oneOf(["up", "down", "neutral"]),
    percent: PropTypes.number,
  }).isRequired,
};
