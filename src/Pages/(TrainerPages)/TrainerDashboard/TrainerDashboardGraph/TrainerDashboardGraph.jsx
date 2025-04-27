/* eslint-disable react/prop-types */
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TrainerDashboardGraph = ({ HistoryDailyStats, AcceptedDailyStats }) => {
  console.log("AcceptedDailyStats", AcceptedDailyStats);

  // Unwrap the accepted stats (because it's an array inside an array for some reason)
  // Unwrap the accepted stats (make sure it's an array inside an array)
  const acceptedStats = Array.isArray(AcceptedDailyStats?.[0])
    ? AcceptedDailyStats[0]
    : [];

  // Map accepted stats to a consistent format
  const formattedAccepted = acceptedStats.map((item) => ({
    date: item.day,
    acceptedSessions: item.sessions,
    acceptedEarnings: parseFloat(item.totalPrice || 0),
  }));

  // Map history stats to a consistent format
  const formattedHistory = HistoryDailyStats.map((item) => {
    const isEnded = item.status === "Ended";
    return {
      date: isEnded ? item["date Ended"] : item.date,
      historySessions: item.sessions,
      totalRefundedAmount: item.totalRefundedAmount || 0,
      totalEarned: item.totalEarned || 0,
    };
  });

  // Merge both accepted and history by date
  const mergedStats = [...formattedAccepted, ...formattedHistory].reduce(
    (acc, curr) => {
      const existing = acc.find((item) => item.date === curr.date);
      if (existing) {
        // Merge if same date
        Object.assign(existing, { ...existing, ...curr });
      } else {
        acc.push(curr);
      }
      return acc;
    },
    []
  );

  // Sort by date (optional but better visually)
  mergedStats.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("-").map(Number);
    const [dayB, monthB, yearB] = b.date.split("-").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
  });

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Booking & Earnings Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mergedStats}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Sessions Bars */}
          <Bar
            dataKey="acceptedSessions"
            fill="#4f46e5"
            name="Accepted Sessions"
          />
          <Bar
            dataKey="historySessions"
            fill="#f59e0b"
            name="History Sessions"
          />
          {/* Earnings Lines */}
          <Line
            type="monotone"
            dataKey="acceptedEarnings"
            stroke="#10b981"
            name="Accepted Earnings"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="totalRefundedAmount"
            stroke="#ef4444"
            name="Refunded Amount"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="totalEarned"
            stroke="#3b82f6"
            name="Completed Earnings"
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrainerDashboardGraph;
