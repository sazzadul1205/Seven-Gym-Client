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
      // You can adjust this if your datasets differ
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

const AdminDashboard = ({
  TrainerSessionRefundStatusData,
  TrainerSessionActiveStatusData,
  TrainerSessionPaymentStatusData,
  TrainerSessionCompletedStatusData,
  DailyTierUpgradePaymentData,
  DailyTierUpgradeRefundData,
  AllTrainersData,
  AllUsersData,
}) => {
  // Dynamically generate months from all relevant datasets
  const MONTHS = extractUniqueMonths(
    TrainerSessionRefundStatusData,
    TrainerSessionActiveStatusData,
    TrainerSessionPaymentStatusData,
    TrainerSessionCompletedStatusData,
    DailyTierUpgradePaymentData,
    DailyTierUpgradeRefundData
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

  // NEW: Active sessions filtering
  const filteredTrainerActive = filterByMonth(
    TrainerSessionActiveStatusData,
    "date"
  );
  const filteredTrainerActivePrev = TrainerSessionActiveStatusData.filter(
    (item) => item.date.startsWith(previousMonth)
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

  // NEW: Active sessions changes
  const activeSessionsChange = calculateChange(
    totalTrainerActiveSessions,
    totalTrainerActiveSessionsPrev
  );
  const activePaymentsChange = calculateChange(
    totalTrainerActivePayments,
    totalTrainerActivePaymentsPrev
  );

  // Card component with comparison arrow
  const Card = ({ icon: Icon, title, value, currency, change }) => {
    const isUp = change.direction === "up";
    const isDown = change.direction === "down";

    return (
      <div className="bg-white rounded shadow p-5 text-center flex flex-col items-center gap-2 relative">
        <Icon className="text-blue-600 text-3xl" />
        <p className="text-gray-600 font-semibold">{title}</p>
        <p className="text-3xl font-bold flex items-center gap-2 justify-center">
          {currency && "৳ "}
          {typeof value === "number" ? value.toLocaleString() : value}
          {/* Change indicator */}
          {isUp && (
            <FiArrowUp className="text-green-500 text-xl" title="Increased" />
          )}
          {isDown && (
            <FiArrowDown className="text-red-500 text-xl" title="Decreased" />
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

  return (
    <div className="p-4 text-black max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gray-700 text-white py-3 rounded mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>

        {/* Month Selector */}
        <select
          className="text-black px-3 py-1 rounded"
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
