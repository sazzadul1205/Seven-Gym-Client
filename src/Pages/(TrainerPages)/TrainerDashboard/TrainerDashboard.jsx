/* eslint-disable react/prop-types */
import TrainerDashboardStatsGrid from "./TrainerDashboardStatsGrid/TrainerDashboardStatsGrid";
import TrainerDashboardGraph from "./TrainerDashboardGraph/TrainerDashboardGraph";

const TrainerDashboard = ({
  TrainerBookingHistoryDailyStats,
  TrainerBookingAcceptedDailyStats,
  TrainerBookingAccepted,
  TrainerBookingHistory,
}) => {
  // Trainer name
  const trainerName = TrainerBookingAccepted[0]?.trainer || "N/A";

  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-300 min-h-screen p-4">
      {/* Title */}
      <h3 className="text-2xl text-center font-bold text-black mb-2">
        {trainerName}&apos;s Dashboard
      </h3>

      {/* Divider */}
      <div className="w-1/3 mx-auto p-[1px] bg-black mb-4" />

      {/* Stats Grid */}
      <TrainerDashboardStatsGrid
        TrainerBookingAccepted={TrainerBookingAccepted}
        TrainerBookingHistory={TrainerBookingHistory}
      />

      <div className="bg-gray-400 p-[1px] my-5" />

      {/* Dashboard Graph */}
      <TrainerDashboardGraph
        HistoryDailyStats={TrainerBookingHistoryDailyStats}
        AcceptedDailyStats={TrainerBookingAcceptedDailyStats}
      />
    </div>
  );
};

export default TrainerDashboard;
