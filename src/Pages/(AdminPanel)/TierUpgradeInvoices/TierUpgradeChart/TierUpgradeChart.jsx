import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    full: date.toISOString().split("T")[0],
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("default", { month: "long" }),
    year: date.getFullYear(),
  };
};

const generateAllDays = (year, month) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const d = new Date(date);
    days.push({
      _id: d.toISOString().split("T")[0],
      day: String(d.getDate()).padStart(2, "0"),
      totalRevenue: 0,
      totalRefunded: 0,
      paymentCount: 0,
      refundCount: 0,
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const TierUpgradeChart = ({
  DailyTierUpgradePaymentData,
  DailyTierUpgradeRefundData,
}) => {
  const mergedDataByMonth = useMemo(() => {
    const allEntries = [
      ...DailyTierUpgradePaymentData,
      ...DailyTierUpgradeRefundData,
    ];
    const months = new Set();

    allEntries.forEach((entry) => {
      const { year } = formatDate(entry._id);
      const month = new Date(entry._id).getMonth() + 1; // 1-based month
      months.add(`${year}-${String(month).padStart(2, "0")}`);
    });

    const mergedByMonth = {};

    months.forEach((key) => {
      const [year, monthStr] = key.split("-");
      const month = parseInt(monthStr);
      const allDays = generateAllDays(year, month - 1); // 0-based for JS Date

      const dataMap = {};
      allDays.forEach((d) => {
        dataMap[d._id] = { ...d };
      });

      DailyTierUpgradePaymentData.forEach((item) => {
        const date = formatDate(item._id).full;
        if (dataMap[date]) {
          dataMap[date].totalRevenue = item.totalRevenue || 0;
          dataMap[date].paymentCount = item.count || 0;
        }
      });

      DailyTierUpgradeRefundData.forEach((item) => {
        const date = formatDate(item._id).full;
        if (dataMap[date]) {
          dataMap[date].totalRefunded = item.totalRefunded || 0;
          dataMap[date].refundCount = item.count || 0;
        }
      });

      // Important: sort the array by _id date ascending to avoid shifting issues
      mergedByMonth[key] = Object.values(dataMap).sort((a, b) =>
        a._id > b._id ? 1 : -1
      );
    });

    return mergedByMonth;
  }, [DailyTierUpgradePaymentData, DailyTierUpgradeRefundData]);

  const availableMonths = Object.keys(mergedDataByMonth).sort().reverse();
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0] || "");

  const selectedData = mergedDataByMonth[selectedMonth] || [];

  const monthLabel = selectedData.length
    ? `${formatDate(selectedData[0]._id).month} ${
        formatDate(selectedData[0]._id).year
      }`
    : "";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {monthLabel} - Tier Upgrade Summary
        </h2>
        <select
          className="border rounded px-2 py-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {availableMonths.map((key) => {
            const [year, month] = key.split("-");
            const label = `${new Date(year, parseInt(month) - 1).toLocaleString(
              "default",
              {
                month: "long",
              }
            )} ${year}`;
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-6 px-5">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={selectedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" type="category" />
            <YAxis />
            <Tooltip />
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

      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" type="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="paymentCount" fill="#8884d8" name="Payment Count" />
            <Bar dataKey="refundCount" fill="#82ca9d" name="Refund Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TierUpgradeChart;
