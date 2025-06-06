import { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Helpers
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

const extractYMDFromDDMMYYYY = (dateStr) => {
  const [dd, mm, yyyy] = dateStr.split("-");
  return { year: yyyy, month: mm, day: dd };
};

// Custom tooltip formatter for amount chart
const formatCurrencyTooltip = (value, name) => {
  return [`${value} $`, name];
};

// Main Component
const TrainerBookingChart = ({
  TrainerBookingRequestStatusData = [],
  TrainerBookingAcceptedStatusData = [],
  TrainerBookingCompletedStatusData = [],
  TrainerBookingCancelledStatusData = [],
}) => {
  const allDates = useMemo(
    () => [
      ...TrainerBookingRequestStatusData,
      ...TrainerBookingAcceptedStatusData,
      ...TrainerBookingCompletedStatusData,
      ...TrainerBookingCancelledStatusData,
    ],
    [
      TrainerBookingRequestStatusData,
      TrainerBookingAcceptedStatusData,
      TrainerBookingCompletedStatusData,
      TrainerBookingCancelledStatusData,
    ]
  );

  const allMonths = useMemo(() => {
    const months = new Set();
    allDates.forEach((item) => {
      const rawDate =
        item.date || item.acceptedDate || item.endDate || item.droppedDate;
      if (rawDate) {
        const { year, month } = extractYMDFromDDMMYYYY(rawDate);
        months.add(`${year}-${month}`);
      }
    });
    return Array.from(months).sort().reverse();
  }, [allDates]);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const fullDates = useMemo(() => {
    const [year, month] = selectedMonth.split("-");
    const days = getDaysInMonth(parseInt(year), parseInt(month));
    return Array.from({ length: days }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      return `${day}-${month}-${year}`;
    });
  }, [selectedMonth]);

  const filterDataByMonth = useCallback(
    (data, dateKey) =>
      data.filter((d) => {
        const rawDate = d[dateKey];
        if (!rawDate) return false;
        const { year, month } = extractYMDFromDDMMYYYY(rawDate);
        return `${year}-${month}` === selectedMonth;
      }),
    [selectedMonth]
  );

  const chartData = useMemo(() => {
    const request = filterDataByMonth(TrainerBookingRequestStatusData, "date");
    const accepted = filterDataByMonth(
      TrainerBookingAcceptedStatusData,
      "acceptedDate"
    );
    const completed = filterDataByMonth(
      TrainerBookingCompletedStatusData,
      "endDate"
    );
    const cancelled = filterDataByMonth(
      TrainerBookingCancelledStatusData,
      "droppedDate"
    );

    return fullDates.map((date) => {
      const r = request.find((d) => d.date === date) || {};
      const a = accepted.find((d) => d.acceptedDate === date) || {};
      const c = completed.find((d) => d.endDate === date) || {};
      const x = cancelled.find((d) => d.droppedDate === date) || {};

      return {
        date,
        requestPrice: r.totalPrice || 0,
        acceptedPrice: a.totalPrice || 0,
        completedPrice: c.totalPrice || 0,
        refundedAmount: x.refundedAmount || 0,
        requestSessions: r.sessions || 0,
        acceptedSessions: a.sessions || 0,
        completedSessions: c.sessions || 0,
        cancelledSessions: x.sessions || 0,
      };
    });
  }, [
    fullDates,
    filterDataByMonth,
    TrainerBookingRequestStatusData,
    TrainerBookingAcceptedStatusData,
    TrainerBookingCompletedStatusData,
    TrainerBookingCancelledStatusData,
  ]);

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split("-");
    const label = new Date(year, parseInt(month) - 1).toLocaleString(
      "default",
      {
        month: "long",
      }
    );
    return `${label} ${year}`;
  }, [selectedMonth]);

  return (
    <div className="w-full space-y-10 bg-gray-200/20">
      {/* Header & Month Selector */}
      <div className="flex justify-between items-center mb-4 bg-gray-400 px-5 py-2 rounded">
        <h3 className="text-white font-semibold text-lg">
          {monthLabel} - Trainer Booking Overview
        </h3>
        <div>
          <label className="text-white block">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-2 py-1 bg-white min-w-[200px]"
          >
            {allMonths.map((monthKey) => {
              const [year, month] = monthKey.split("-");
              const label = new Date(year, month - 1).toLocaleString(
                "default",
                {
                  month: "long",
                }
              );
              return (
                <option key={monthKey} value={monthKey}>
                  {label} {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Line Chart: Booking Amounts */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Booking Amounts</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => d.split("-")[0]} />
            <YAxis />
            <Tooltip formatter={formatCurrencyTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="requestPrice"
              stroke="#8884d8"
              name="Requested"
            />
            <Line
              type="monotone"
              dataKey="acceptedPrice"
              stroke="#82ca9d"
              name="Accepted"
            />
            <Line
              type="monotone"
              dataKey="completedPrice"
              stroke="#ffc658"
              name="Completed"
            />
            <Line
              type="monotone"
              dataKey="refundedAmount"
              stroke="#ff7f7f"
              name="Refunded"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Sessions Count */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Sessions Count</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => d.split("-")[0]} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="requestSessions"
              stroke="#8884d8"
              name="Requested Sessions"
            />
            <Line
              type="monotone"
              dataKey="acceptedSessions"
              stroke="#82ca9d"
              name="Accepted Sessions"
            />
            <Line
              type="monotone"
              dataKey="completedSessions"
              stroke="#ffc658"
              name="Completed Sessions"
            />
            <Line
              type="monotone"
              dataKey="cancelledSessions"
              stroke="#ff7f7f"
              name="Cancelled Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

TrainerBookingChart.propTypes = {
  TrainerBookingRequestStatusData: PropTypes.array,
  TrainerBookingAcceptedStatusData: PropTypes.array,
  TrainerBookingCompletedStatusData: PropTypes.array,
  TrainerBookingCancelledStatusData: PropTypes.array,
};

export default TrainerBookingChart;

// Trainer Booking Request Status Data : (2)
// [
//     {
//         "totalPrice": 770,
//         "sessions": 10,
//         "count": 4,
//         "date": "04-06-2025"
//     },
//     {
//         "totalPrice": 120,
//         "sessions": 2,
//         "count": 1,
//         "date": "05-06-2025"
//     }
// ]
// Trainer Booking Accepted Status Data : (2)
// [
//     {
//         "totalPrice": 520,
//         "sessions": 9,
//         "count": 4,
//         "acceptedDate": "01-06-2025"
//     },
//     {
//         "totalPrice": 155,
//         "sessions": 7,
//         "count": 3,
//         "acceptedDate": "05-06-2025"
//     }
// ]
// Trainer Booking Completed Status Data :
// [
//     {
//         "totalPrice": 120,
//         "sessions": 2,
//         "count": 1,
//         "endDate": "30-05-2025"
//     }
// ]
// Trainer Booking Cancelled Status Data : (2)
// [
//     {
//         "refundedAmount": 207.5,
//         "sessions": 6,
//         "count": 4,
//         "droppedDate": "01-06-2025"
//     },
//     {
//         "refundedAmount": 150,
//         "sessions": 5,
//         "count": 2,
//         "droppedDate": "05-06-2025"
//     }
// ]
