import PropTypes from "prop-types";
import DashboardCardPrimary from "../../(AdminPanel)/AdminDashboard/AdminDashboardCards/DashboardCardPrimary/DashboardCardPrimary";
import DashboardCardSecondary from "../../(AdminPanel)/AdminDashboard/AdminDashboardCards/DashboardCardSecondary/DashboardCardSecondary";

// Import Component

const ClassControlDashboard = ({
  ClassBookingRequestData,
  ClassBookingAcceptedData,
  ClassBookingRejectedData,
  ClassBookingCompletedData,
  ClassBookingRefundStatusData,
  ClassBookingPaymentStatusData,
  ClassBookingCompletedStatusData,
}) => {
  return (
    <>
      <DashboardCardPrimary
        ClassBookingRequestData={ClassBookingRequestData}
        ClassBookingAcceptedData={ClassBookingAcceptedData}
        ClassBookingRejectedData={ClassBookingRejectedData}
        ClassBookingCompletedData={ClassBookingCompletedData}
        ClassBookingRefundStatusData={ClassBookingRefundStatusData}
        ClassBookingPaymentStatusData={ClassBookingPaymentStatusData}
        ClassBookingCompletedStatusData={ClassBookingCompletedStatusData}
      />

      <DashboardCardSecondary
        ClassBookingRefundStatusData={ClassBookingRefundStatusData}
        ClassBookingPaymentStatusData={ClassBookingPaymentStatusData}
        ClassBookingCompletedStatusData={ClassBookingCompletedStatusData}
      />


    </>
  );
};

// Prop Validation
ClassControlDashboard.propTypes = {
  ClassBookingRequestData: PropTypes.any,
  ClassBookingAcceptedData: PropTypes.any,
  ClassBookingRejectedData: PropTypes.any,
  ClassBookingCompletedData: PropTypes.any,
  ClassBookingRefundStatusData: PropTypes.any,
  ClassBookingPaymentStatusData: PropTypes.any,
  ClassBookingCompletedStatusData: PropTypes.any,
};

export default ClassControlDashboard;
