import { useMemo, useState, useCallback } from "react";

// import Prop
import PropTypes from "prop-types";

// Import Rechart Components
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

const TrainerSessionChart = ({
  TrainerSessionActiveStatusData = [],
  TrainerSessionRefundStatusData = [],
  TrainerSessionPaymentStatusData = [],
  TrainerSessionCompletedStatusData = [],
}) => {
  // Combine all session data arrays into one using useMemo to avoid unnecessary recalculations
  const allDates = useMemo(
    () => [
      ...TrainerSessionActiveStatusData,
      ...TrainerSessionRefundStatusData,
      ...TrainerSessionPaymentStatusData,
      ...TrainerSessionCompletedStatusData,
    ],
    [
      TrainerSessionActiveStatusData,
      TrainerSessionRefundStatusData,
      TrainerSessionPaymentStatusData,
      TrainerSessionCompletedStatusData,
    ]
  );

  // Extract unique months from allDates (format: YYYY-MM)
  const allMonths = useMemo(() => {
    const months = new Set();
    allDates.forEach((item) => {
      if (item.date) {
        const [year, month] = item.date.split("-");
        months.add(`${year}-${month}`);
      }
    });
    // Return months in descending order
    return Array.from(months).sort().reverse();
  }, [allDates]);

  // Set the default selected month to the current month (format: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Get the total number of days in a given month/year
  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  // Create a full list of date strings (YYYY-MM-DD) for the selected month
  const fullDates = useMemo(() => {
    const [year, month] = selectedMonth.split("-");
    const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
  }, [selectedMonth]);

  // Filter a data array to only include entries for the selected month
  const filterDataByMonth = useCallback(
    (data) => {
      return data.filter((d) => d.date && d.date.startsWith(selectedMonth));
    },
    [selectedMonth]
  );

  // Generate chart data by matching each date with counts and amounts from each category
  const chartData = useMemo(() => {
    const activeData = filterDataByMonth(TrainerSessionActiveStatusData);
    const refundData = filterDataByMonth(TrainerSessionRefundStatusData);
    const paidData = filterDataByMonth(TrainerSessionPaymentStatusData);
    const completedData = filterDataByMonth(TrainerSessionCompletedStatusData);

    return fullDates.map((date) => {
      const active = activeData.find((d) => d.date === date) || {
        count: 0,
        totalPaid: 0,
      };
      const refund = refundData.find((d) => d.date === date) || {
        count: 0,
        totalRefunded: 0,
      };
      const paid = paidData.find((d) => d.date === date) || {
        count: 0,
        totalPaid: 0,
      };
      const completed = completedData.find((d) => d.date === date) || {
        count: 0,
        totalPaid: 0,
      };

      // Return combined data for chart plotting
      return {
        date,
        activeCount: active.count,
        refundCount: refund.count,
        paidCount: paid.count,
        completedCount: completed.count,
        activePaid: active.totalPaid,
        refundPaid: refund.totalRefunded,
        paidTotal: paid.totalPaid,
        completedPaid: completed.totalPaid,
      };
    });
  }, [
    filterDataByMonth,
    fullDates,
    TrainerSessionActiveStatusData,
    TrainerSessionRefundStatusData,
    TrainerSessionPaymentStatusData,
    TrainerSessionCompletedStatusData,
  ]);

  // Create a readable label for the selected month (e.g., "June 2025")
  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split("-");
    const monthName = new Date(year, parseInt(month, 10) - 1).toLocaleString(
      "default",
      {
        month: "long",
      }
    );
    return `${monthName} ${year}`;
  }, [selectedMonth]);

  return (
    <div className="w-full space-y-10 bg-gray-200/20">
      {/* Header and Month Selector */}
      <div className="flex bg-gray-400 justify-between items-center mb-4 px-5 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          {monthLabel} - Trainer Session Summary
        </h3>
        <div className="flex flex-col">
          <label className="text-white">Select Month</label>
          <select
            className="border rounded min-w-[250px] bg-white hover:cursor-pointer px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {allMonths.map((monthKey) => {
              const [year, month] = monthKey.split("-");
              const label = `${new Date(
                year,
                parseInt(month) - 1
              ).toLocaleString("default", {
                month: "long",
              })} ${year}`;
              return (
                <option key={monthKey} value={monthKey}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Payment Overview Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => d.split("-")[2]} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="activePaid"
            name="Active Paid"
            stroke="#8884d8"
          />
          <Line
            type="monotone"
            dataKey="refundPaid"
            name="Refunded"
            stroke="#ff7300"
          />
          <Line
            type="monotone"
            dataKey="paidTotal"
            name="Paid Total"
            stroke="#82ca9d"
          />
          <Line
            type="monotone"
            dataKey="completedPaid"
            name="Completed Paid"
            stroke="#ffc658"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Session Counts Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => d.split("-")[2]} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="activeCount"
            name="Active Count"
            stroke="#8884d8"
          />
          <Line
            type="monotone"
            dataKey="refundCount"
            name="Refund Count"
            stroke="#ff7300"
          />
          <Line
            type="monotone"
            dataKey="paidCount"
            name="Paid Count"
            stroke="#82ca9d"
          />
          <Line
            type="monotone"
            dataKey="completedCount"
            name="Completed Count"
            stroke="#ffc658"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Prop Validation
TrainerSessionChart.propTypes = {
  TrainerSessionActiveStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      count: PropTypes.number,
      totalPaid: PropTypes.number,
    })
  ),
  TrainerSessionRefundStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      count: PropTypes.number,
      totalRefunded: PropTypes.number,
    })
  ),
  TrainerSessionPaymentStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      count: PropTypes.number,
      totalPaid: PropTypes.number,
    })
  ),
  TrainerSessionCompletedStatusData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      count: PropTypes.number,
      totalPaid: PropTypes.number,
    })
  ),
};

export default TrainerSessionChart;
