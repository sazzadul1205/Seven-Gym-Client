import { useState, useEffect } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Tabs
import AllTrainerBookingHistory from "./AllTrainerBookingHistory/AllTrainerBookingHistory";
import AllTrainerBookingRequest from "./AllTrainerBookingRequest/AllTrainerBookingRequest";
import AllTrainerBookingCanceled from "./AllTrainerBookingCanceled/AllTrainerBookingCanceled";
import AllTrainerBookingAccepted from "./AllTrainerBookingAccepted/AllTrainerBookingAccepted";
import AllTrainerBookingCompleted from "./AllTrainerBookingCompleted/AllTrainerBookingCompleted";
import TrainerBookingChart from "../TrainerSessionsInvoices/TrainerBookingChart/TrainerBookingChart";

// Define all tabs clearly
const TABS = [
  { key: "request", label: "Booking Requests" },
  { key: "accepted", label: "Accepted Bookings" },
  { key: "canceled", label: "Canceled Bookings" },
  { key: "completed", label: "Completed Bookings" },
  { key: "history", label: "Booking History" },
];

const AllTrainerBookings = ({
  AllTrainerBookingRequestData,
  AllTrainerBookingHistoryData,
  AllTrainerBookingAcceptedData,
  AllTrainerBookingCompletedData,
  AllTrainerBookingCancelledData,

  // Status Data
  TrainerBookingRequestStatusData,
  TrainerBookingAcceptedStatusData,
  TrainerBookingCompletedStatusData,
  TrainerBookingCancelledStatusData,
}) => {
  const [activeTab, setActiveTab] = useState("request");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Tab rendering logic
  const renderTabContent = () => {
    switch (activeTab) {
      case "request":
        return (
          <AllTrainerBookingRequest
            AllTrainerBookingRequestData={AllTrainerBookingRequestData}
          />
        );
      case "accepted":
        return (
          <AllTrainerBookingAccepted
            AllTrainerBookingAcceptedData={AllTrainerBookingAcceptedData}
          />
        );
      case "canceled":
        return (
          <AllTrainerBookingCanceled
            AllTrainerBookingCancelledData={AllTrainerBookingCancelledData}
          />
        );
      case "completed":
        return (
          <AllTrainerBookingCompleted
            AllTrainerBookingCompletedData={AllTrainerBookingCompletedData}
          />
        );
      case "history":
        return (
          <AllTrainerBookingHistory
            AllTrainerBookingHistoryData={AllTrainerBookingHistoryData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="text-black">
      <TrainerBookingChart
        TrainerBookingRequestStatusData={TrainerBookingRequestStatusData}
        TrainerBookingAcceptedStatusData={TrainerBookingAcceptedStatusData}
        TrainerBookingCompletedStatusData={TrainerBookingCompletedStatusData}
        TrainerBookingCancelledStatusData={TrainerBookingCancelledStatusData}
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

//  Prop Validation
AllTrainerBookings.propTypes = {
  AllTrainerBookingRequestData: PropTypes.array,
  AllTrainerBookingHistoryData: PropTypes.array,
  AllTrainerBookingAcceptedData: PropTypes.array,
  AllTrainerBookingCompletedData: PropTypes.array,
  AllTrainerBookingCancelledData: PropTypes.array,

  TrainerBookingRequestStatusData: PropTypes.array,
  TrainerBookingAcceptedStatusData: PropTypes.array,
  TrainerBookingCompletedStatusData: PropTypes.array,
  TrainerBookingCancelledStatusData: PropTypes.array,
};

export default AllTrainerBookings;
