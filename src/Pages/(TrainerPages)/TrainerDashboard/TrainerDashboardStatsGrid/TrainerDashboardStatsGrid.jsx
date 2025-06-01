import { useMemo } from "react";
import PropTypes from "prop-types";

// Single statistic card component
const StatCard = ({ title, value, color }) => (
  <div className="bg-gradient-to-br hover:bg-gradient-to-tl from-gray-100 to-gray-400 border border-gray-400 hover:border-gray-600 shadow-md hover:shadow-2xl rounded-2xl py-6 px-4 text-center transition-all duration-300 ease-in-out">
    {/* Statistic title */}
    <h4 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
      {title}
    </h4>
    {/* Decorative divider */}
    <div className="mx-auto w-1/2 h-1 bg-gray-400 rounded-full mb-2" />
    {/* Statistic value */}
    <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

// Trainer tier card: shows tier, base earnings, deduction, and final earnings
const TrainerTierCard = ({ tier = "bronze", baseEarnings = 0 }) => {
  // Define tier settings: label, discount rate, styling
  const tierSettings = {
    bronze: {
      label: "Bronze",
      discount: 0.4,
      colorClasses: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
      borderClass: "border-orange-600",
    },
    silver: {
      label: "Silver",
      discount: 0.35,
      colorClasses: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
      borderClass: "border-gray-400",
    },
    gold: {
      label: "Gold",
      discount: 0.3,
      colorClasses: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
      borderClass: "border-yellow-300",
    },
    diamond: {
      label: "Diamond",
      discount: 0.25,
      colorClasses: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
      borderClass: "border-blue-300",
    },
    platinum: {
      label: "Platinum",
      discount: 0.2,
      colorClasses: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
      borderClass: "border-gray-500",
    },
  };

  // Normalize tier key
  const key = tier.toLowerCase();
  const { label, discount, colorClasses, borderClass } =
    tierSettings[key] || tierSettings.bronze;

  // Compute adjusted earnings after deduction
  const adjusted = baseEarnings * (1 - discount);

  return (
    <div
      className={`w-full md:w-1/3 rounded-2xl border-2 ${borderClass} shadow-md p-4 text-center space-y-2 bg-linear-to-bl hover:bg-linear-to-tr from-gray-100 to-gray-300 transition-all duration-300 ease-in-out`}
    >
      {/* Tier badge */}
      <h2
        className={`text-lg font-semibold capitalize ${colorClasses} px-12 py-1 rounded-full inline-block`}
      >
        {label} Tier
      </h2>

      {/* Base earnings display */}
      <p className="text-gray-800">
        <span className="font-semibold">Base Earnings:</span> ${" "}
        {baseEarnings.toFixed(2)}
      </p>

      {/* Deduction rate */}
      <p className="text-gray-700">
        <span className="font-semibold">Deduction:</span>{" "}
        {(discount * 100).toFixed(0)}%
      </p>

      {/* Final earnings */}
      <p className="text-lg font-bold text-green-700">
        You Earn: $ {adjusted.toFixed(2)}
      </p>
    </div>
  );
};

TrainerTierCard.propTypes = {
  tier: PropTypes.string.isRequired,
  baseEarnings: PropTypes.number.isRequired,
};

// Main grid component: shows stats and tier card
const TrainerDashboardStatsGrid = ({
  TrainerBookingAccepted,
  TrainerBookingHistory,
  TrainerData,
}) => {
  // Memoize calculations to avoid recalculation on each render
  const stats = useMemo(() => {
    // Compute base earnings: sum of accepted bookings + refund amounts
    const base =
      TrainerBookingAccepted.reduce(
        (sum, b) => sum + parseFloat(b.totalPrice || 0),
        0
      ) +
      TrainerBookingHistory.reduce(
        (sum, h) => sum + (parseFloat(h.RefundAmount) || 0),
        0
      );

    // Count current bookings
    const bookingsCount = TrainerBookingAccepted.length;

    // Count total sessions across bookings
    const sessionsCount = TrainerBookingAccepted.reduce(
      (sum, b) => sum + (b.sessions?.length || 0),
      0
    );

    // Sum refunded amounts
    const refunded = TrainerBookingHistory.reduce(
      (sum, h) => sum + (parseFloat(h.RefundAmount) || 0),
      0
    );

    // Sum completed booking earnings
    const completed = TrainerBookingHistory.filter(
      (h) => h.status === "Ended"
    ).reduce((sum, h) => sum + parseFloat(h.totalPrice || 0), 0);

    return { base, bookingsCount, sessionsCount, refunded, completed };
  }, [TrainerBookingAccepted, TrainerBookingHistory]);

  // Trainer tier from data
  const tier = TrainerData?.[0]?.tier || "bronze";

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats.bookingsCount}
          color="text-blue-600"
        />
        <StatCard
          title="Total Sessions"
          value={stats.sessionsCount}
          color="text-purple-600"
        />
        <StatCard title="Status" value="Active" color="text-gray-800" />
        <StatCard
          title="Total Earnings"
          value={`$${stats.base.toFixed(2)}`}
          color="text-yellow-600"
        />
        <StatCard
          title="Refunded"
          value={`$${stats.refunded.toFixed(2)}`}
          color="text-red-600"
        />
        <StatCard
          title="Completed Earnings"
          value={`$${stats.completed.toFixed(2)}`}
          color="text-green-600"
        />
      </div>

      {/* Tier card shows deduction logic */}
      <div className="flex justify-center mt-5">
        <TrainerTierCard tier={tier} baseEarnings={stats.completed} />
      </div>
    </div>
  );
};

TrainerDashboardStatsGrid.propTypes = {
  TrainerBookingAccepted: PropTypes.arrayOf(
    PropTypes.shape({
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessions: PropTypes.array,
    })
  ).isRequired,
  TrainerBookingHistory: PropTypes.arrayOf(
    PropTypes.shape({
      RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
    })
  ).isRequired,
  TrainerData: PropTypes.arrayOf(PropTypes.shape({ tier: PropTypes.string }))
    .isRequired,
};

export default TrainerDashboardStatsGrid;
