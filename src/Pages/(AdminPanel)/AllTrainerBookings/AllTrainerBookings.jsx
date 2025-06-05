/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

import AllTrainerBookingHistory from "./AllTrainerBookingHistory/AllTrainerBookingHistory";
import AllTrainerBookingRequest from "./AllTrainerBookingRequest/AllTrainerBookingRequest";
import AllTrainerBookingCanceled from "./AllTrainerBookingCanceled/AllTrainerBookingCanceled";
import AllTrainerBookingAccepted from "./AllTrainerBookingAccepted/AllTrainerBookingAccepted";
import AllTrainerBookingCompleted from "./AllTrainerBookingCompleted/AllTrainerBookingCompleted";

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

  // console.log(
  //   "Trainer Booking Request Status Data :",
  //   TrainerBookingRequestStatusData
  // );
  // console.log(
  //   "Trainer Booking Accepted Status Data :",
  //   TrainerBookingAcceptedStatusData
  // );
  // console.log(
  //   "Trainer Booking Completed Status Data :",
  //   TrainerBookingCompletedStatusData
  // );
  // console.log(
  //   "Trainer Booking Cancelled Status Data :",
  //   TrainerBookingCancelledStatusData
  // );

  return (
    <div className="text-black">
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

export default AllTrainerBookings;
