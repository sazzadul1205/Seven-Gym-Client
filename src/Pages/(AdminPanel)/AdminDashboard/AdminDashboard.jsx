import AdminDashboardCards from "./AdminDashboardCards/AdminDashboardCards";
import AdminDashboardTierUpgradeGraph from "./AdminDashboardTierUpgradeGraph/AdminDashboardTierUpgradeGraph";

const AdminDashboard = ({
  TrainerSessionRefundStatusData,
  TrainerSessionActiveStatusData,
  TrainerSessionPaymentStatusData,
  TrainerSessionCompletedStatusData,
  DailyTierUpgradePaymentData,
  DailyTierUpgradeRefundData,
  AllTrainersData,
  AllUsersData,
}) => {
  return (
    <div className="text-black">
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Admin Dashboard
        </h3>
      </div>

      {/* Card Section */}
      <AdminDashboardCards
        AllUsersData={AllUsersData}
        AllTrainersData={AllTrainersData}
        DailyTierUpgradeRefundData={DailyTierUpgradeRefundData}
        DailyTierUpgradePaymentData={DailyTierUpgradePaymentData}
        TrainerSessionRefundStatusData={TrainerSessionRefundStatusData}
        TrainerSessionActiveStatusData={TrainerSessionActiveStatusData}
        TrainerSessionPaymentStatusData={TrainerSessionPaymentStatusData}
        TrainerSessionCompletedStatusData={TrainerSessionCompletedStatusData}
      />

      <AdminDashboardTierUpgradeGraph
        DailyTierUpgradePaymentData={DailyTierUpgradePaymentData}
        DailyTierUpgradeRefundData={DailyTierUpgradeRefundData}
      />
    </div>
  );
};

export default AdminDashboard;
