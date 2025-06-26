import { useCallback, useMemo, useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import ReChart Components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Get number of days in a given month/year
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

// Extract year, month, day from "YYYY-MM-DD" formatted string
const extractYMDFromDDMMYYYY = (dateStr) => {
  const [yyyy, mm, dd] = dateStr.split("-");
  return { year: yyyy, month: mm, day: dd };
};

// Format tooltip to show currency value with dollar symbol
const formatCurrencyTooltip = (value, name) => {
  return [`${value} $`, name];
};

const ClassBookingChart = ({
  ClassBookingRefundStatusData,
  ClassBookingPaymentStatusData,
}) => {
  // Combine all dates from both datasets
  const allDates = useMemo(
    () => [...ClassBookingRefundStatusData, ...ClassBookingPaymentStatusData],
    [ClassBookingRefundStatusData, ClassBookingPaymentStatusData]
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

    return fullDates.map((date) => {
      const r = refunds.find((d) => d.date === date) || {};
      const p = payments.find((d) => d.date === date) || {};

      return {
        date,
        paymentAmount: p.totalPrice || 0,
        refundAmount: r.refundAmount || 0,
        paymentCount: p.count || 0,
        refundCount: r.count || 0,
      };
    });
  }, [
    fullDates,
    filterDataByMonth,
    ClassBookingRefundStatusData,
    ClassBookingPaymentStatusData,
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
    <div className="w-full space-y-10 bg-gray-200/20">
      {/* Header and Month Selector */}
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

      {/* Booking & Refund Amounts Line Chart */}
      <div>
        <h4 className="text-lg font-semibold mb-2 pl-2">
          Booking & Refund Amounts
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Booking & Refund Counts Line Chart */}
      <div>
        <h4 className="text-lg font-semibold mb-2 pl-2">Transaction Counts</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => d.split("-")[2]} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="paymentCount"
              stroke="#8884d8"
              name="Payment Count"
            />
            <Line
              type="monotone"
              dataKey="refundCount"
              stroke="#ffc658"
              name="Refund Count"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// PropTypes validation
ClassBookingChart.propTypes = {
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
};

export default ClassBookingChart;
