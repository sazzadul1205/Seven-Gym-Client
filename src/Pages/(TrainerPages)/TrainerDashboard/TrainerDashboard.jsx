// Import Prop Type
import PropTypes from "prop-types";

// Import Components
import TrainerDashboardSessionHistory from "./TrainerDashboardSessionHistory/TrainerDashboardSessionHistory";
import TrainerDashboardTestimonials from "./TrainerDashboardTestimonials/TrainerDashboardTestimonials";
import TrainerDashboardStatsGrid from "./TrainerDashboardStatsGrid/TrainerDashboardStatsGrid";
import TrainerDashboardSchedule from "./TrainerDashboardSchedule/TrainerDashboardSchedule";
import TrainerDashboardGraph from "./TrainerDashboardGraph/TrainerDashboardGraph";

const TrainerDashboard = ({
  TrainerBookingAcceptedDailyStats,
  TrainerBookingHistoryDailyStats,
  TrainerBookingAccepted,
  TrainerBookingHistory,
  TrainerScheduleData,
  TrainerData,
}) => {
  return (
    <div className="bg-gradient-to-t from-gray-100 to-gray-300 min-h-screen p-1 md:p-4">
      {/* Title */}
      <h3 className="text-2xl text-center font-bold text-black mb-2">
        {TrainerData.name}&apos;s Dashboard
      </h3>

      {/* Divider */}
      <div className="w-full md:w-1/3 mx-auto p-[1px] bg-black mb-4" />

      {/* Stats Grid */}
      <TrainerDashboardStatsGrid
        TrainerData={TrainerData}
        TrainerBookingHistory={TrainerBookingHistory}
        TrainerBookingAccepted={TrainerBookingAccepted}
        TrainerBookingAcceptedDailyStats={TrainerBookingAcceptedDailyStats}
        TrainerBookingHistoryDailyStats={TrainerBookingHistoryDailyStats}
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

      <TrainerDashboardTestimonials TrainerDetails={TrainerData || {}} />
    </div>
  );
};

// Prop Validation
TrainerDashboard.propTypes = {
  TrainerBookingAcceptedDailyStats: PropTypes.arrayOf(PropTypes.object)
    .isRequired,
  TrainerBookingHistoryDailyStats: PropTypes.arrayOf(PropTypes.object)
    .isRequired,
  TrainerBookingAccepted: PropTypes.arrayOf(PropTypes.object).isRequired,
  TrainerBookingHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  TrainerScheduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
  TrainerData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TrainerDashboard;
