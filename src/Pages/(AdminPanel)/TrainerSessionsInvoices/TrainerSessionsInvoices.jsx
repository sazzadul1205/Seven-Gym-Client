import { useEffect, useState } from "react";
/* eslint-disable react/prop-types */

import TrainerSessionActiveInvoices from "./TrainerSessionActiveInvoices/TrainerSessionActiveInvoices";
import TrainerSessionCompletedInvoices from "./TrainerSessionCompletedInvoices/TrainerSessionCompletedInvoices";
import TrainerSessionPaymentInvoices from "./TrainerSessionPaymentInvoices/TrainerSessionPaymentInvoices";
import TrainerSessionRefundInvoices from "./TrainerSessionRefundInvoices/TrainerSessionRefundInvoices";
import TrainerSessionChart from "./TrainerSessionChart/TrainerSessionChart";

const TABS = [
  { key: "active", label: "Active Invoices" },
  { key: "completed", label: "Completed Invoices" },
  { key: "paid", label: "All Paid Invoices" },
  { key: "refunded", label: "Refunded Invoices" },
];

const TrainerSessionsInvoices = ({
  TrainerSessionRefundData = [],
  TrainerSessionActiveData = [],
  TrainerSessionPaymentData = [],
  TrainerSessionCompletedData = [],

  // Status Data
  TrainerSessionActiveStatusData = [],
  TrainerSessionRefundStatusData = [],
  TrainerSessionPaymentStatusData = [],
  TrainerSessionCompletedStatusData = [],
}) => {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300); // Adjust delay if needed
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return (
          <TrainerSessionActiveInvoices
            TrainerSessionActiveData={TrainerSessionActiveData}
          />
        );
      case "completed":
        return (
          <TrainerSessionCompletedInvoices
            TrainerSessionCompletedData={TrainerSessionCompletedData}
          />
        );
      case "paid":
        return (
          <TrainerSessionPaymentInvoices
            TrainerSessionPaymentData={TrainerSessionPaymentData}
          />
        );
      case "refunded":
        return (
          <TrainerSessionRefundInvoices
            TrainerSessionRefundData={TrainerSessionRefundData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-black space-y-1 pb-5">
      <TrainerSessionChart
        TrainerSessionActiveStatusData={TrainerSessionActiveStatusData}
        TrainerSessionRefundStatusData={TrainerSessionRefundStatusData}
        TrainerSessionPaymentStatusData={TrainerSessionPaymentStatusData}
        TrainerSessionCompletedStatusData={TrainerSessionCompletedStatusData}
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
                : "border-gray text-gray-600 hover:text-blue-500 font-semibold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content or Loading */}
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

export default TrainerSessionsInvoices;
