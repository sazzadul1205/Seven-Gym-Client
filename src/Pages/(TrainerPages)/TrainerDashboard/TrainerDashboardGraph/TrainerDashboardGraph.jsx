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

  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full text-black">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Sessions & Earnings Overview
      </h2>

      {/* Graphs */}
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Sessions Overview Section */}
        <div className="flex-1">
          {/* Chart Title with dynamic month-year label */}
          <h3 className="text-xl md:text-2xl font-semibold mb-2 text-center">
            Sessions Overview ({monthYearLabel})
          </h3>

          {/* Chart Container with responsiveness */}
          <ResponsiveContainer
            width="100%"
            height={400}
            className="max-h-[400px] mx-auto"
          >
            {/* LineChart rendering session data */}
            <LineChart
              data={preparedData} // Chart data, prepared based on session information
              margin={{ top: 0, right: 0, bottom: 0, left: isMobile ? -20 : 0 }} // Adjust left margin based on screen size
            >
              {/* Grid lines in chart */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X-Axis setup, using 'day' as data key */}
              <XAxis dataKey="day" tickFormatter={(t) => t.toString()} />

              {/* Y-Axis setup */}
              <YAxis />

              {/* Tooltip on hover, formats date and value */}
              <Tooltip
                labelFormatter={(value) =>
                  currentMonth.date(value).format("DD - MMM")
                }
                formatter={(value, name) => [value, name]}
              />

              {/* Legend for lines */}
              <Legend />

              {/* Conditionally render "Sessions Booked" line if visibility is true */}
              {sessionsVisibility.sessions && (
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name="Session Booked"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}

              {/* Conditionally render "Sessions Completed" line if visibility is true */}
              {sessionsVisibility.completedSessions && (
                <Line
                  type="monotone"
                  dataKey="completedSessions"
                  name="Session Completed"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Toggle Buttons for showing/hiding session lines */}
          <div className="flex gap-4 justify-center mt-4 flex-wrap">
            {/* Toggle button for "Sessions Booked" line */}
            <button
              onClick={() => toggleSessionLine("sessions")}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg ${
                sessionsVisibility.sessions
                  ? "bg-gradient-to-bl from-indigo-300 to-indigo-600 text-white"
                  : "bg-gray-300 text-gray-600 hover:bg-gray-300/60"
              }`}
            >
              {sessionsVisibility.sessions ? "Hide" : "Show"} Sessions Booked
            </button>

            {/* Toggle button for "Sessions Completed" line */}
            <button
              onClick={() => toggleSessionLine("completedSessions")}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg ${
                sessionsVisibility.completedSessions
                  ? "bg-gradient-to-bl from-orange-300 to-orange-600 text-white"
                  : "bg-gray-300 text-gray-600 hover:bg-gray-300/60"
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
          <h3 className="text-xl md:text-2xl font-semibold mb-2 text-center">
            Total Earnings Over Time ({monthYearLabel})
          </h3>

          {/* Earnings Overview : Chart */}
          <ResponsiveContainer
            width="100%"
            height={400}
            className="max-h-[400px]"
          >
            <LineChart
              data={preparedData}
              margin={{ top: 20, right: 0, bottom: 0, left: isMobile ? -20 : 0 }} // Adjust left margin based on screen size
            >
              {/* Adds background grid lines with dashed strokes */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X-Axis: displays the day number (from `day` field in data) */}
              <XAxis dataKey="day" tickFormatter={(t) => t.toString()} />

              {/* Y-Axis: automatically scales based on data values */}
              <YAxis />

              {/* Tooltip shown on hover: formats date and value display */}
              <Tooltip
                labelFormatter={
                  (value) => currentMonth.date(value).format("DD - MMM") // Formats date labels
                }
                formatter={(val, name) => [val, name]} // Shows value and series name
              />

              {/* Legend shows which color corresponds to which data line */}
              <Legend />

              {/* Conditionally render the "Actual Earnings" line */}
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

              {/* Conditionally render the "Estimated Earnings" line */}
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

              {/* Conditionally render the "Refunded Amount" line */}
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
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg cursor-pointer ${
                earningsVisibility.totalEarned
                  ? "bg-gradient-to-bl hover:bg-gradient-to-tr from-emerald-300 to-emerald-600 text-white"
                  : "bg-gray-300 hover:bg-gray-300/50 text-gray-600"
              }`}
            >
              {earningsVisibility.totalEarned ? "Hide" : "Show"} Actual Earnings
            </button>

            {/* Est. Earnings */}
            <button
              onClick={() => toggleEarningsLine("estimatedEarnings")}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg cursor-pointer ${
                earningsVisibility.estimatedEarnings
                  ? "bg-gradient-to-bl hover:bg-gradient-to-tr from-yellow-300 to-yellow-600 text-white"
                  : "bg-gray-300 hover:bg-gray-300/50 text-gray-600"
              }`}
            >
              {earningsVisibility.estimatedEarnings ? "Hide" : "Show"} Est.
              Earnings
            </button>

            {/* Refunded Amount */}
            <button
              onClick={() => toggleEarningsLine("totalRefundedAmount")}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg cursor-pointer ${
                earningsVisibility.totalRefundedAmount
                  ? "bg-gradient-to-bl hover:bg-gradient-to-tr from-red-300 to-red-600 text-white"
                  : "bg-gray-300 hover:bg-gray-300/50 text-gray-600"
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

export default TrainerDashboardGraph;
