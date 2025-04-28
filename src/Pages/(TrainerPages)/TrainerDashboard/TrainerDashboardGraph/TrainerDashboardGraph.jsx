import { useState, useMemo } from "react";

// Importing necessary components from recharts for rendering line charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Importing dayjs for date manipulation
import dayjs from "dayjs";

// Importing PropTypes for type-checking props
import PropTypes from "prop-types";

// Main functional component for the Trainer Dashboard Graph
const TrainerDashboardGraph = ({ HistoryDailyStats, AcceptedDailyStats }) => {
  // State to track the start of the current month
  const [currentMonth] = useState(dayjs().startOf("month"));

  // State to toggle visibility of sessions lines (Booked vs Completed)
  const [sessionsVisibility, setSessionsVisibility] = useState({
    sessions: true,
    completedSessions: true,
  });

  // State to toggle visibility of earnings lines (Total Earned, Estimated Earnings, Refunded Amount)
  const [earningsVisibility, setEarningsVisibility] = useState({
    totalEarned: true,
    estimatedEarnings: true,
    totalRefundedAmount: true,
  });

  // Function to generate an array of dates for the current month
  const generateMonthRange = (monthStart) => {
    const daysInMonth = monthStart.daysInMonth(); // Get total days in the current month
    const range = [];
    for (let d = 1; d <= daysInMonth; d++) {
      range.push(monthStart.startOf("month").date(d)); // Push each day in the month to the range
    }
    return range;
  };

  // useMemo hook to memoize the processed data for performance optimization
  const preparedData = useMemo(() => {
    // Ensure the stats arrays are valid, otherwise fallback to empty arrays
    const acceptedStats = Array.isArray(AcceptedDailyStats)
      ? AcceptedDailyStats
      : [];
    const historyStats = Array.isArray(HistoryDailyStats)
      ? HistoryDailyStats
      : [];

    // Generate date range for the month
    const dateRange = generateMonthRange(currentMonth);

    // Create maps to group and track data by date
    const bookedMap = acceptedStats.reduce((acc, item) => {
      acc[item.day] = {
        sessions: item.sessions,
        totalPrice: parseFloat(item.totalPrice || 0),
        estimatedEarnings: parseFloat(item.estimatedEarnings || 0),
      };
      return acc;
    }, {});

    const completedMap = historyStats
      .filter((i) => i.status === "Ended") // Filter only completed sessions
      .reduce((acc, item) => {
        acc[item["date Ended"]] = item.sessions;
        return acc;
      }, {});

    const refundedMap = historyStats
      .filter((i) => i.totalRefundedAmount != null) // Filter sessions that have a refunded amount
      .reduce((acc, item) => {
        acc[item.date] = item.totalRefundedAmount;
        return acc;
      }, {});

    const earnedMap = historyStats
      .filter((i) => i.status === "Ended" && i.totalEarned != null) // Filter completed sessions with earned amount
      .reduce((acc, item) => {
        acc[item["date Ended"]] = item.totalEarned;
        return acc;
      }, {});

    // Prepare the data for chart rendering by mapping over the date range
    const data = dateRange.map((dateObj) => {
      const fullDate = dateObj.format("DD-MM-YYYY");
      return {
        day: dateObj.date(),
        sessions: bookedMap[fullDate]?.sessions || 0,
        completedSessions: completedMap[fullDate] || 0,
        totalEarned: earnedMap[fullDate] || 0,
        totalRefundedAmount: refundedMap[fullDate] || 0,
        estimatedEarnings: bookedMap[fullDate]?.estimatedEarnings || 0,
      };
    });

    return data; // Return the prepared data to be used by the charts
  }, [AcceptedDailyStats, HistoryDailyStats, currentMonth]);

  // Format the current month for displaying in the chart title
  const monthYearLabel = currentMonth.format("MMMM - YYYY");

  // Function to toggle visibility of session lines
  const toggleSessionLine = (lineKey) => {
    setSessionsVisibility((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  // Function to toggle visibility of earnings lines
  const toggleEarningsLine = (lineKey) => {
    setEarningsVisibility((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  return (
    <div className="w-full text-black">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Sessions & Earnings Overview
      </h2>

      {/* Graphs */}
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Sessions Overview */}
        <div className="flex-1">
          {/* Sessions Overview : Title */}
          <h3 className="text-xl font-semibold mb-2 text-center">
            Sessions Overview ({monthYearLabel})
          </h3>

          {/* Sessions Overview : Chart */}
          <ResponsiveContainer width="100%" className={"max-h-[400px]"}>
            <LineChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(t) => t.toString()} />
              <YAxis />

              <Tooltip
                labelFormatter={(value) =>
                  currentMonth.date(value).format("DD - MMM")
                }
                formatter={(val, name) => [
                  val,
                  name === "sessions"
                    ? "Sessions Booked"
                    : "Sessions Completed",
                ]}
              />

              <Legend />

              {/* Render Session Booked Line */}
              {sessionsVisibility.sessions && (
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#4f46e5"
                  name="Sessions Booked"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}

              {/* Render Completed Sessions Line */}
              {sessionsVisibility.completedSessions && (
                <Line
                  type="monotone"
                  dataKey="completedSessions"
                  stroke="#f97316"
                  name="Sessions Completed"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Buttons to toggle session lines */}
          <div className="flex gap-4 justify-center mt-4 flex-wrap">
            {/* Sessions Booked */}
            <button
              onClick={() => toggleSessionLine("sessions")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
                sessionsVisibility.sessions
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {sessionsVisibility.sessions ? "Hide" : "Show"} Sessions Booked
            </button>

            {/* Sessions Completed */}
            <button
              onClick={() => toggleSessionLine("completedSessions")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
                sessionsVisibility.completedSessions
                  ? "bg-orange-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {sessionsVisibility.completedSessions ? "Hide" : "Show"} Sessions
              Completed
            </button>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="flex-1">
          {/* Earnings Overview : Title */}
          <h3 className="text-xl font-semibold mb-2 text-center">
            Total Earnings Over Time ({monthYearLabel})
          </h3>

          {/* Earnings Overview : Chart */}
          <ResponsiveContainer width="100%" className={"max-h-[400px]"}>
            <LineChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(t) => t.toString()} />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  currentMonth.date(value).format("DD - MMM")
                }
                formatter={(val, name) => [val, name]}
              />
              <Legend />

              {/* Render Actual Earnings Line */}
              {earningsVisibility.totalEarned && (
                <Line
                  type="monotone"
                  dataKey="totalEarned"
                  name="Actual Earnings"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}

              {/* Render Estimated Earnings Line */}
              {earningsVisibility.estimatedEarnings && (
                <Line
                  type="monotone"
                  dataKey="estimatedEarnings"
                  name="Est. Earnings"
                  stroke="#d08700"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              )}

              {/* Render Refunded Amount Line */}
              {earningsVisibility.totalRefundedAmount && (
                <Line
                  type="monotone"
                  dataKey="totalRefundedAmount"
                  name="Refunded Amount"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Buttons to toggle earnings lines */}
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {/* Actual Earnings */}
            <button
              onClick={() => toggleEarningsLine("totalEarned")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
                earningsVisibility.totalEarned
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {earningsVisibility.totalEarned ? "Hide" : "Show"} Actual Earnings
            </button>

            {/* Est. Earnings */}
            <button
              onClick={() => toggleEarningsLine("estimatedEarnings")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
                earningsVisibility.estimatedEarnings
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {earningsVisibility.estimatedEarnings ? "Hide" : "Show"} Est.
              Earnings
            </button>

            {/* Refunded Amount */}
            <button
              onClick={() => toggleEarningsLine("totalRefundedAmount")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
                earningsVisibility.totalRefundedAmount
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {earningsVisibility.totalRefundedAmount ? "Hide" : "Show"}{" "}
              Refunded Amount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop Validation for expected data types
TrainerDashboardGraph.propTypes = {
  HistoryDailyStats: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string,
      "date Ended": PropTypes.string,
      date: PropTypes.string,
      sessions: PropTypes.number,
      totalRefundedAmount: PropTypes.number,
      totalEarned: PropTypes.number,
    })
  ),
  AcceptedDailyStats: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string,
      sessions: PropTypes.number,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      estimatedEarnings: PropTypes.number,
    })
  ),
};

// Exporting the component to be used in other parts of the application
export default TrainerDashboardGraph;
