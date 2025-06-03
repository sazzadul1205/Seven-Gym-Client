import { useMemo, useState } from "react";

// Import Prop Validation
import PropTypes from "prop-types";

// Import Rechart Components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatDate = (dateStr) => {
  // Parse date string as UTC midnight to avoid timezone shifts
  const date = new Date(dateStr + "T00:00:00Z");

  return {
    full: date.toISOString().split("T")[0], // Full ISO date string yyyy-mm-dd
    day: String(date.getUTCDate()).padStart(2, "0"), // Day of month, zero-padded
    month: date.toLocaleString("default", { month: "long", timeZone: "UTC" }), // Month name in UTC
    year: date.getUTCFullYear(), // Year number
    timestamp: date.getTime(), // Milliseconds since epoch UTC
  };
};

const generateAllDays = (year, month) => {
  const days = [];
  // Start from first day of the month at midnight UTC
  let date = new Date(Date.UTC(year, month, 1));
  const targetMonth = month;

  // Loop while the month is still the target month
  while (date.getUTCMonth() === targetMonth) {
    days.push({
      _id: date.toISOString().split("T")[0], // yyyy-mm-dd string
      day: String(date.getUTCDate()).padStart(2, "0"), // zero-padded day
      totalRevenue: 0, // initialize revenue to zero
      totalRefunded: 0, // initialize refunded to zero
      paymentCount: 0, // initialize payment count
      refundCount: 0, // initialize refund count
      timestamp: date.getTime(), // timestamp in ms
    });
    // Move to the next day by adding 24 hours in ms
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  }

  return days;
};

const TierUpgradeChart = ({
  DailyTierUpgradePaymentData = [],
  DailyTierUpgradeRefundData = [],
}) => {
  // Memoized merge of payment and refund data by month for efficient re-renders
  const mergedDataByMonth = useMemo(() => {
    // Combine all entries from payment and refund datasets
    const allEntries = [
      ...DailyTierUpgradePaymentData,
      ...DailyTierUpgradeRefundData,
    ];

    // Collect unique months in "YYYY-MM" format from all entries
    const months = new Set();

    allEntries.forEach((entry) => {
      const { year } = formatDate(entry._id);
      // getMonth returns 0-11, add 1 for 1-12
      const month = new Date(entry._id).getMonth() + 1;
      months.add(`${year}-${String(month).padStart(2, "0")}`);
    });

    // Object to hold merged data keyed by month string
    const mergedByMonth = {};

    months.forEach((key) => {
      const [year, monthStr] = key.split("-");
      const month = parseInt(monthStr, 10);

      // Generate array for all days in that month with initial zeroed data
      const allDays = generateAllDays(year, month - 1);

      // Create map for quick lookup by date string (yyyy-mm-dd)
      const dataMap = {};
      allDays.forEach((d) => {
        dataMap[d._id] = { ...d };
      });

      // Populate payment data into map
      DailyTierUpgradePaymentData.forEach((item) => {
        const date = formatDate(item._id).full;
        if (dataMap[date]) {
          dataMap[date].totalRevenue = item.totalRevenue || 0;
          dataMap[date].paymentCount = item.count || 0;
          dataMap[date].day = formatDate(item._id).day; // recalc day for consistency
        }
      });

      // Populate refund data into map
      DailyTierUpgradeRefundData.forEach((item) => {
        const date = formatDate(item._id).full;
        if (dataMap[date]) {
          dataMap[date].totalRefunded = item.totalRefunded || 0;
          dataMap[date].refundCount = item.count || 0;
          dataMap[date].day = formatDate(item._id).day;
        }
      });

      // Convert map back to sorted array by timestamp ascending
      mergedByMonth[key] = Object.values(dataMap).sort(
        (a, b) => a.timestamp - b.timestamp
      );
    });

    return mergedByMonth;
  }, [DailyTierUpgradePaymentData, DailyTierUpgradeRefundData]);

  // List of available months sorted newest first
  const availableMonths = Object.keys(mergedDataByMonth).sort().reverse();
  // Selected month state, default to latest month or empty string if none
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0] || "");

  // Data for currently selected month or empty array if none
  const selectedData = mergedDataByMonth[selectedMonth] || [];

  // Label for the selected month heading (e.g. "May 2025")
  const monthLabel = selectedData.length
    ? `${formatDate(selectedData[0]._id).month} ${
        formatDate(selectedData[0]._id).year
      }`
    : "";

  // Format X axis tick for charts (day number from timestamp)
  const xAxisTickFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return date.getDate();
  };

  // Format tooltip label to show "day month" format (e.g. "30 May")
  const tooltipLabelFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="w-full space-y-10 bg-gray-200/20">
      {/* Header and month selector */}
      <div className="flex bg-gray-400 justify-between items-center mb-4 px-5 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          {monthLabel} - Tier Upgrade Summary
        </h3>
        <div className="flex flex-col">
          <label className="text-white">Select Month</label>
          <select
            className="border rounded min-w-[250px] bg-white hover:cursor-pointer px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((key) => {
              const [year, month] = key.split("-");
              const label = `${new Date(
                year,
                parseInt(month, 10) - 1
              ).toLocaleString("default", {
                month: "long",
              })} ${year}`;
              return (
                <option key={key} value={key}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Line Chart for revenue and refunded amounts */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={selectedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={xAxisTickFormatter}
            scale="time"
          />
          <YAxis />
          <Tooltip labelFormatter={tooltipLabelFormatter} />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#00C49F"
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="totalRefunded"
            stroke="#FF8042"
            name="Refunded"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Bar Chart for payment and refund counts */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={selectedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={xAxisTickFormatter}
            scale="time"
          />
          <YAxis />
          <Tooltip labelFormatter={tooltipLabelFormatter} />
          <Legend />
          <Bar dataKey="paymentCount" fill="#8884d8" name="Payment Count" />
          <Bar dataKey="refundCount" fill="#82ca9d" name="Refund Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// PropTypes validation for the component props
TierUpgradeChart.propTypes = {
  DailyTierUpgradePaymentData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      totalRevenue: PropTypes.number,
      count: PropTypes.number,
    })
  ).isRequired,
  DailyTierUpgradeRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      totalRefunded: PropTypes.number,
      count: PropTypes.number,
    })
  ).isRequired,
};

export default TierUpgradeChart;
