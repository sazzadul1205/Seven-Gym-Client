/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
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
import { useState, useMemo } from "react";
import dayjs from "dayjs";

const TrainerDashboardGraph = ({ HistoryDailyStats, AcceptedDailyStats }) => {
  const acceptedStats = Array.isArray(AcceptedDailyStats)
    ? AcceptedDailyStats
    : [];

  // eslint-disable-next-line no-unused-vars
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  // 🛠 Correct: Generate real date objects
  const generateMonthRange = (monthStart) => {
    const daysInMonth = monthStart.daysInMonth();
    const range = [];

    for (let day = 1; day <= daysInMonth; day++) {
      range.push(monthStart.date(day));
    }

    return range;
  };

  const preparedData = useMemo(() => {
    const dateRange = generateMonthRange(currentMonth);

    const statsMap = acceptedStats.reduce((acc, item) => {
      acc[item.day] = {
        sessions: item.sessions,
        totalPrice: parseFloat(item.totalPrice || 0),
      };
      return acc;
    }, {});

    return dateRange.map((dateObj) => {
      const fullDate = dateObj.format("DD-MM-YYYY"); // Match the key format
      return {
        day: dateObj.date(), // Only day number (1-31)
        sessions: statsMap[fullDate]?.sessions || 0,
        totalPrice: statsMap[fullDate]?.totalPrice || 0,
      };
    });
  }, [acceptedStats, currentMonth]);

  const monthYearLabel = currentMonth.format("MMMM - YYYY");

  console.log("HistoryDailyStats :", HistoryDailyStats);

  return (
    <div className="w-full text-black">
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Sessions & Earnings Overview
      </h2>

      <div className="flex flex-wrap">
        {/* Sessions Graph */}
        <div className="flex-1 h-[400px]">
          <h3 className="text-xl font-semibold mb-2 text-center">
            Booked Sessions Over Time ({monthYearLabel})
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(tick) => tick.toString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#4f46e5"
                name="Sessions"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Earnings Graph */}
        <div className="flex-1 h-[400px]">
          <h3 className="text-xl font-semibold mb-2 text-center">
            Total Earnings Over Time ({monthYearLabel})
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(tick) => tick.toString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalPrice"
                stroke="#10b981"
                name="Earnings"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboardGraph;
