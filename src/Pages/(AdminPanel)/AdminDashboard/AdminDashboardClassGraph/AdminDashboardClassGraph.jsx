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
  const [yyyy, mm, dd] = dateStr.split("-");
  return { year: yyyy, month: mm, day: dd };
};

// Custom tooltip formatter for amount chart
const formatCurrencyTooltip = (value, name) => {
  return [`${value} $`, name];
};

const AdminDashboardClassGraph = ({
  ClassBookingRefundStatusData,
  ClassBookingPaymentStatusData,
  ClassBookingCompletedStatusData,
}) => {
  // Combine all dates from both datasets
  const allDates = useMemo(
    () => [
      ...ClassBookingRefundStatusData,
      ...ClassBookingPaymentStatusData,
      ...ClassBookingCompletedStatusData,
    ],
    [
      ClassBookingRefundStatusData,
      ClassBookingPaymentStatusData,
      ClassBookingCompletedStatusData,
    ]
  );

  // Extract unique months in "YYYY-MM" format from the data
  const allMonths = useMemo(() => {
    const months = new Set();
    allDates.forEach((item) => {
      const rawDate = item.date;
      if (rawDate) {
        const { year, month } = extractYMDFromDDMMYYYY(rawDate);
        months.add(`${year}-${month}`);
      }
    });
    return Array.from(months).sort().reverse(); // Sort for dropdown
  }, [allDates]);

  // Default to current month on initial render
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Generate all full dates (e.g., 2025-06-01 to 2025-06-30) for the selected month
  const fullDates = useMemo(() => {
    const [year, month] = selectedMonth.split("-");
    const days = getDaysInMonth(parseInt(year), parseInt(month));
    return Array.from({ length: days }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
  }, [selectedMonth]);

  // Filter data based on the selected month
  const filterDataByMonth = useCallback(
    (data) =>
      data.filter((d) => {
        const rawDate = d.date;
        if (!rawDate) return false;
        const { year, month } = extractYMDFromDDMMYYYY(rawDate);
        return `${year}-${month}` === selectedMonth;
      }),
    [selectedMonth]
  );

  // Build chart-ready data combining refunds and payments by date
  const chartData = useMemo(() => {
    const refunds = filterDataByMonth(ClassBookingRefundStatusData);
    const payments = filterDataByMonth(ClassBookingPaymentStatusData);
    const completed = filterDataByMonth(ClassBookingCompletedStatusData);

    return fullDates.map((date) => {
      const r = refunds.find((d) => d.date === date) || {};
      const p = payments.find((d) => d.date === date) || {};
      const s = completed.find((d) => d.date === date) || {};

      return {
        date,
        paymentAmount: p.totalPrice || 0,
        refundAmount: r.refundAmount || 0,
        completedAmount: s.totalPrice || 0,
        paymentCount: p.count || 0,
        refundCount: r.count || 0,
        completedCount: s.count || 0,
      };
    });
  }, [
    fullDates,
    filterDataByMonth,
    ClassBookingRefundStatusData,
    ClassBookingPaymentStatusData,
    ClassBookingCompletedStatusData,
  ]);

  // Display month label like "June 2025"
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

      {/* Booking, Refund & Completion Amounts */}
      <div>
        <h4 className="text-lg font-semibold mb-2 pl-2">
          Booking, Refund & Completion Amounts
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => d.split("-")[2]} />
            <YAxis />
            <Tooltip formatter={formatCurrencyTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="paymentAmount"
              stroke="#82ca9d"
              name="Total Payments"
            />
            <Line
              type="monotone"
              dataKey="refundAmount"
              stroke="#ff7f7f"
              name="Total Refunds"
            />
            <Line
              type="monotone"
              dataKey="completedAmount"
              stroke="#3b82f6"
              name="Total Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

// Import Prop Validation
AdminDashboardClassGraph.propTypes = {
  ClassBookingRefundStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      refundAmount: PropTypes.number,
      count: PropTypes.number,
    })
  ).isRequired,
  ClassBookingPaymentStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalPrice: PropTypes.number,
      count: PropTypes.number,
    })
  ).isRequired,
  ClassBookingCompletedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalPrice: PropTypes.number,
      count: PropTypes.number,
    })
  ).isRequired,
};

export default AdminDashboardClassGraph;
