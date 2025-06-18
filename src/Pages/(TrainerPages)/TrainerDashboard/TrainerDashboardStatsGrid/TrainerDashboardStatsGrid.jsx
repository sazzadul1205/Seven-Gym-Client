import { useMemo } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import {
  FaClipboardList,
  FaDumbbell,
  FaToggleOn,
  FaDollarSign,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

import { FaMedal, FaTrophy, FaGem, FaCrown, FaStar } from "react-icons/fa";

const TrainerDashboardStatsGrid = ({
  TrainerBookingHistoryDailyStats,
  TrainerBookingAccepted,
  TrainerData,
}) => {
  // Memoize calculations to avoid recalculation on each render
  const stats = useMemo(() => {
    // Base earnings from accepted bookings (TrainerBookingAccepted)
    const base = TrainerBookingAccepted.reduce(
      (sum, b) => sum + parseFloat(b.totalPrice || 0),
      0
    );

    // Bookings count
    const bookingsCount = TrainerBookingAccepted.length;

    // Total sessions from accepted bookings
    const sessionsCount = TrainerBookingAccepted.reduce(
      (sum, b) => sum + (b.sessions?.length || 0),
      0
    );

    // Refunded amount from daily history stats
    const refunded = TrainerBookingHistoryDailyStats.reduce((sum, entry) => {
      return sum + (parseFloat(entry.totalRefundedAmount) || 0);
    }, 0);

    // Completed earnings from daily history stats
    const completed = TrainerBookingHistoryDailyStats.reduce((sum, entry) => {
      if (entry.status === "Ended") {
        return sum + (parseFloat(entry.totalEarned) || 0);
      }
      return sum;
    }, 0);

    return { base, bookingsCount, sessionsCount, refunded, completed };
  }, [TrainerBookingAccepted, TrainerBookingHistoryDailyStats]);

  // Trainer tier from data
  const tier = TrainerData.tier || "bronze";

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card
          title="Total Bookings"
          value={stats.bookingsCount}
          color="text-blue-600"
          icon={FaClipboardList}
        />
        <Card
          title="Total Sessions"
          value={stats.sessionsCount}
          color="text-purple-600"
          icon={FaDumbbell}
        />
        <Card
          title="Status"
          value="Active"
          color="text-gray-800"
          icon={FaToggleOn}
        />
        <Card
          title="Total Earnings"
          value={`$${stats.base.toFixed(2)}`}
          color="text-yellow-600"
          icon={FaDollarSign}
        />
        <Card
          title="Refunded"
          value={`$${stats.refunded.toFixed(2)}`}
          color="text-red-600"
          icon={FaMoneyBillWave}
        />
        <Card
          title="Completed Earnings"
          value={`$${stats.completed.toFixed(2)}`}
          color="text-green-600"
          icon={FaCheckCircle}
        />
      </div>

      {/* Tier card shows deduction logic */}
      <div className="flex  justify-center mt-5">
        <TrainerTierCard tier={tier} baseEarnings={stats.completed} />
      </div>
    </div>
  );
};

// Prop Validation
TrainerDashboardStatsGrid.propTypes = {
  TrainerBookingAccepted: PropTypes.arrayOf(
    PropTypes.shape({
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sessions: PropTypes.array,
    })
  ).isRequired,
  TrainerBookingHistoryDailyStats: PropTypes.arrayOf(
    PropTypes.shape({
      totalRefundedAmount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      totalEarned: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
    })
  ).isRequired,
  TrainerData: PropTypes.shape({
    tier: PropTypes.oneOf(["bronze", "silver", "gold", "diamond", "platinum"]),
  }).isRequired,
};

export default TrainerDashboardStatsGrid;

const Card = ({ title, value, color, icon: Icon }) => (
  <div className="bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-200 rounded-xl shadow hover:shadow-xl p-5 text-center flex flex-col items-center gap-2 relative cursor-default">
    {/* Icon */}
    {Icon && <Icon className={`text-3xl ${color}`} />}

    {/* Statistic title */}
    <h3 className="text-gray-600 font-semibold">{title}</h3>

    {/* Decorative divider */}
    <div className="mx-auto w-1/2 h-1 bg-gray-400 rounded-full mb-2" />

    {/* Statistic value */}
    <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.elementType, // accepts icon components
};

const TrainerTierCard = ({ tier = "bronze", baseEarnings = 0 }) => {
  const tierSettings = {
    bronze: {
      label: "Bronze",
      discount: 0.4,
      icon: FaMedal,
      description: "Entry level tier with higher deduction rate.",
      colorClasses: "bg-orange-600 text-white ring-2 ring-orange-300 shadow-lg",
      borderClass: "border-orange-600",
    },
    silver: {
      label: "Silver",
      discount: 0.35,
      icon: FaStar,
      description: "Improved performance with moderate deductions.",
      colorClasses: "bg-gray-400 text-white ring-2 ring-gray-200 shadow-lg",
      borderClass: "border-gray-400",
    },
    gold: {
      label: "Gold",
      discount: 0.3,
      icon: FaTrophy,
      description: "High-performing tier with lower fee.",
      colorClasses: "bg-yellow-500 text-white ring-2 ring-yellow-300 shadow-lg",
      borderClass: "border-yellow-300",
    },
    diamond: {
      label: "Diamond",
      discount: 0.25,
      icon: FaGem,
      description: "Elite tier with premium earning benefits.",
      colorClasses: "bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg",
      borderClass: "border-blue-300",
    },
    platinum: {
      label: "Platinum",
      discount: 0.2,
      icon: FaCrown,
      description: "Top-tier with the lowest deduction rate.",
      colorClasses: "bg-gray-800 text-white ring-2 ring-gray-500 shadow-lg",
      borderClass: "border-gray-500",
    },
  };

  const key = tier.toLowerCase();
  const {
    label,
    discount,
    icon: Icon,
    description,
    colorClasses,
    borderClass,
  } = tierSettings[key] || tierSettings.bronze;

  const adjusted = baseEarnings * (1 - discount);

  return (
    <div
      className={`max-w-5xl w-full mx-auto flex flex-col md:flex-row justify-between items-center px-6 sm:px-10 py-8 sm:py-10 bg-gradient-to-tl hover:bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out gap-5 md:gap-8 border-2 ${borderClass}`}
    >
      {/* Icon & Tier Info */}
      <div className="flex flex-col items-center md:items-start gap-2 md:gap-3 w-full md:w-1/2 text-center md:text-left">
        <Icon
          className={`text-2xl md:text-4xl ${colorClasses} p-2 rounded-full`}
        />
        <h2
          className={`font-semibold capitalize px-5 py-1 rounded-full ${colorClasses}`}
        >
          {label} Tier
        </h2>
        <p className="text-sm sm:text-base text-gray-600 italic max-w-xs md:max-w-md">
          {description}
        </p>
      </div>

      {/* Decorative Divider for Desktop */}
      <div className="hidden md:block w-px h-24 bg-gray-300 rounded-full" />

      {/* Earnings Section */}
      <div className="w-full md:w-1/2 text-center md:text-right space-y-1 sm:space-y-2">
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">Base Earnings:</span> ${" "}
          {baseEarnings.toFixed(2)}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">Deduction:</span>{" "}
          {(discount * 100).toFixed(0)}%
        </p>
        <p className="text-lg sm:text-xl font-bold text-green-700">
          Final Earnings: ${adjusted.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

// Prop Validation
TrainerTierCard.propTypes = {
  tier: PropTypes.oneOf(["bronze", "silver", "gold", "diamond", "platinum"]),
  baseEarnings: PropTypes.number.isRequired,
};

// Tier Default Data
TrainerTierCard.defaultProps = {
  tier: "bronze",
};
