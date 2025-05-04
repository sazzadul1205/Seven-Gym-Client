import TrainerDashboardStatsGrid from "./TrainerDashboardStatsGrid/TrainerDashboardStatsGrid";
import TrainerDashboardGraph from "./TrainerDashboardGraph/TrainerDashboardGraph";
import TrainerDashboardSchedule from "./TrainerDashboardSchedule/TrainerDashboardSchedule";
import TrainerDashboardSessionHistory from "./TrainerDashboardSessionHistory/TrainerDashboardSessionHistory";
import TrainerDashboardTestimonials from "./TrainerDashboardTestimonials/TrainerDashboardTestimonials";

const TrainerDashboard = ({
  TrainerBookingAcceptedDailyStats,
  TrainerBookingHistoryDailyStats,
  TrainerBookingAccepted,
  TrainerBookingHistory,
  TrainerScheduleData,
  TrainerData,
}) => {
  // Trainer name
  const trainerName = TrainerBookingAccepted[0]?.trainer || "N/A";

  // Extract trainer details
  const TrainerProfileData = TrainerData?.[0] || null;

  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-300 min-h-screen p-1 md:p-4">
      {/* Title */}
      <h3 className="text-2xl text-center font-bold text-black mb-2">
        {trainerName}&apos;s Dashboard
      </h3>

      {/* Divider */}
      <div className="w-full md:w-1/3 mx-auto p-[1px] bg-black mb-4" />

      {/* Stats Grid */}
      <TrainerDashboardStatsGrid
        TrainerBookingAccepted={TrainerBookingAccepted}
        TrainerBookingHistory={TrainerBookingHistory}
      />

      {/* Divider */}
      <div className="bg-gray-400 p-[1px] my-5" />

      {/* Dashboard Graph */}
      <TrainerDashboardGraph
        HistoryDailyStats={TrainerBookingHistoryDailyStats}
        AcceptedDailyStats={TrainerBookingAcceptedDailyStats}
      />

      {/* Divider */}
      <div className="bg-gray-400 p-[1px] my-5" />

      {/* Next Schedule & Notifications */}
      <TrainerDashboardSchedule TrainerScheduleData={TrainerScheduleData} />

      {/* Divider */}
      <div className="bg-gray-400 p-[1px] my-5" />

      {/* Trainer Session History */}
      <TrainerDashboardSessionHistory
        TrainerBookingAccepted={TrainerBookingAccepted}
        TrainerBookingHistory={TrainerBookingHistory}
      />

      {/* Divider */}
      <div className="bg-gray-400 p-[1px] my-5" />

      <TrainerDashboardTestimonials TrainerDetails={TrainerProfileData || {}} />
    </div>
  );
};

export default TrainerDashboard;
