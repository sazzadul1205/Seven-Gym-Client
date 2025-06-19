import { useMemo, useState } from "react";

// Import Prop Validation
import PropTypes from "prop-types";

// Import Rechart Components
import {
  LineChart,
  Line,
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
    full: date.toISOString().split("T")[0],
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: date.toLocaleString("default", { month: "long", timeZone: "UTC" }),
    year: date.getUTCFullYear(),
    timestamp: date.getTime(),
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
      _id: date.toISOString().split("T")[0],
      day: String(date.getUTCDate()).padStart(2, "0"),
      totalRevenue: 0,
      totalRefunded: 0,
      paymentCount: 0,
      refundCount: 0,
      timestamp: date.getTime(),
    });
    // Move to the next day by adding 24 hours in ms
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  }

  return days;
};

const AdminDashboardTierUpgradeGraph = ({
  DailyTierUpgradePaymentData,
  DailyTierUpgradeRefundData,
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
          dataMap[date].day = formatDate(item._id).day;
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
    <>
      {/* Header and month selector */}
      <div className="relative bg-gray-400 px-4 py-3 text-white rounded-t flex items-center justify-center">
        {/* Centered Title */}
        <h3 className="text-lg font-semibold text-center">
          {monthLabel} - Tier Upgrade Summary
        </h3>

        {/* Month Selector aligned to right absolutely */}
        <div className="absolute right-4 flex items-center gap-2">
          <label className="text-white">Select Month</label>
          <select
            className="border rounded min-w-[250px] bg-white text-black hover:cursor-pointer px-2 py-1"
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
      <div className="py-10 px-5">
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
      </div>
    </>
  );
};

// Prop Validation
AdminDashboardTierUpgradeGraph.propTypes = {
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

export default AdminDashboardTierUpgradeGraph;
