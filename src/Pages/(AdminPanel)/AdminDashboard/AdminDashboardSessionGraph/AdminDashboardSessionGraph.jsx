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

const AdminDashboardSessionGraph = ({
  TrainerBookingRequestStatusData,
  TrainerBookingAcceptedStatusData,
  TrainerBookingCompletedStatusData,
  TrainerBookingCancelledStatusData,
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
    <>
      {/* Header & Month Selector */}
      <div className="relative bg-gray-400 px-4 py-3 text-white rounded-t flex items-center justify-center">
        {/* Centered Title */}
        <h3 className="text-lg font-semibold text-center">
          {monthLabel} - Trainer Booking Overview
        </h3>

        {/* Month Selector aligned to right absolutely */}
        <div className="absolute right-4 flex items-center gap-2">
          <label className="text-whit">Select Month</label>
          <select
            className="border rounded min-w-[250px] bg-white text-black hover:cursor-pointer px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
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
      <div className="py-10 px-5">
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
    </>
  );
};

// Prop Validation
AdminDashboardSessionGraph.propTypes = {
  TrainerBookingRequestStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalPrice: PropTypes.number,
      sessions: PropTypes.number,
    })
  ).isRequired,

  TrainerBookingAcceptedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      acceptedDate: PropTypes.string.isRequired,
      totalPrice: PropTypes.number,
      sessions: PropTypes.number,
    })
  ).isRequired,

  TrainerBookingCompletedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      endDate: PropTypes.string.isRequired,
      totalPrice: PropTypes.number,
      sessions: PropTypes.number,
    })
  ).isRequired,

  TrainerBookingCancelledStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      droppedDate: PropTypes.string.isRequired,
      refundedAmount: PropTypes.number,
      sessions: PropTypes.number,
    })
  ).isRequired,
};

export default AdminDashboardSessionGraph;
