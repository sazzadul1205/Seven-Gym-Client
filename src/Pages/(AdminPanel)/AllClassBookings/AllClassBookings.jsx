import { useState, useEffect } from "react";

// Import Packages
import PropTypes from "prop-types";
import AllClassBookingRequest from "./AllClassBookingRequest/AllClassBookingRequest";
import AllClassBookingAccepted from "./AllClassBookingAccepted/AllClassBookingAccepted";
import AllClassBookingCompleted from "./AllClassBookingCompleted/AllClassBookingCompleted";
import AllClassBookingRejected from "./AllClassBookingRejected/AllClassBookingRejected";
import AllClassBookingPayedRecept from "./AllClassBookingPayedRecept/AllClassBookingPayedRecept";
import AllClassBookingRefundedRecept from "./AllClassBookingRefundedRecept/AllClassBookingRefundedRecept";
import ClassBookingChart from "./ClassBookingChart/ClassBookingChart";

// Define all tabs clearly
const TABS = [
  { key: "Request", label: "Class Booking Request" },
  { key: "Accepted", label: "Class Accepted Bookings" },
  { key: "Completed", label: "Class Completed Bookings" },
  { key: "Rejected", label: "Class Rejected Bookings" },
  { key: "Payed", label: "Class Payed Recept" },
  { key: "Refunded", label: "Class Refunded Recept" },
];

const AllClassBookings = ({
  ClassBookingPayedData,
  ClassBookingRefundData,
  ClassBookingRequestData,
  ClassBookingRejectedData,
  ClassBookingAcceptedData,
  ClassBookingCompletedData,
  ClassBookingRefundStatusData,
  ClassBookingPaymentStatusData,
  ClassBookingCompletedStatusData,
}) => {
  const [activeTab, setActiveTab] = useState("Request");
  const [isLoading, setIsLoading] = useState(false);

  // Show loading spinner briefly when switching tabs
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Tab rendering logic
  const renderTabContent = () => {
    switch (activeTab) {
      case "Request":
        return (
          <AllClassBookingRequest
            ClassBookingRequestData={ClassBookingRequestData}
          />
        );
      case "Accepted":
        return (
          <AllClassBookingAccepted
            ClassBookingAcceptedData={ClassBookingAcceptedData}
          />
        );
      case "Completed":
        return (
          <AllClassBookingCompleted
            ClassBookingCompletedData={ClassBookingCompletedData}
          />
        );
      case "Rejected":
        return (
          <AllClassBookingRejected
            ClassBookingRejectedData={ClassBookingRejectedData}
          />
        );
      case "Payed":
        return (
          <AllClassBookingPayedRecept
            ClassBookingPayedData={ClassBookingPayedData}
          />
        );
      case "Refunded":
        return (
          <AllClassBookingRefundedRecept
            ClassBookingRefundData={ClassBookingRefundData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="text-black">
      <ClassBookingChart
        ClassBookingRefundStatusData={ClassBookingRefundStatusData}
        ClassBookingPaymentStatusData={ClassBookingPaymentStatusData}
        ClassBookingCompletedStatusData={ClassBookingCompletedStatusData}
      />

      {/* Tab Buttons */}
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-500 font-semibold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content or Loading Spinner */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

// Prop Validation
AllClassBookings.propTypes = {
  ClassBookingPayedData: PropTypes.array,
  ClassBookingRefundData: PropTypes.array,
  ClassBookingRequestData: PropTypes.array,
  ClassBookingRejectedData: PropTypes.array,
  ClassBookingAcceptedData: PropTypes.array,
  ClassBookingCompletedData: PropTypes.array,
  ClassBookingRefundStatusData: PropTypes.array,
  ClassBookingPaymentStatusData: PropTypes.array,
  ClassBookingCompletedStatusData: PropTypes.array,
};

export default AllClassBookings;
