/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import TrainerSessionActiveInvoices from "./TrainerSessionActiveInvoices/TrainerSessionActiveInvoices";
import TrainerSessionCompletedInvoices from "./TrainerSessionCompletedInvoices/TrainerSessionCompletedInvoices";
import TrainerSessionPaymentInvoices from "./TrainerSessionPaymentInvoices/TrainerSessionPaymentInvoices";
import TrainerSessionRefundInvoices from "./TrainerSessionRefundInvoices/TrainerSessionRefundInvoices";

const TABS = [
  { key: "active", label: "Active Invoices" },
  { key: "completed", label: "Completed Invoices" },
  { key: "paid", label: "All Paid Invoices" },
  { key: "refunded", label: "Refunded Invoices" },
];

const TrainerSessionsInvoices = ({
  TrainerSessionRefundData = [],
  TrainerSessionPaymentData = [],
}) => {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Get all refunded stripePaymentIDs
  const refundedIDs = new Set(
    TrainerSessionRefundData.map(
      (refund) => refund?.PaymentRefund?.stripePaymentID
    )
  );

  // Step 2: Get all active sessions (non-refunded)
  const activeSessions = TrainerSessionPaymentData.filter(
    (payment) => !refundedIDs.has(payment?.stripePaymentID)
  );

  // Step 3: Categorize sessions into completed and ongoing
  const TrainerSessionCompletedData = [];
  const TrainerSessionActiveData = [];

  const today = new Date();

  activeSessions.forEach((session) => {
    const paidAtStr = session?.BookingInfo?.paidAt;
    const durationWeeks = session?.BookingInfo?.durationWeeks || 0;

    if (!paidAtStr || durationWeeks === 0) {
      TrainerSessionActiveData.push(session);
      return;
    }

    let paidAt;

    // Try to handle both "31-05-2025T07:38" and ISO format "2025-05-31T12:40:36.556Z"
    if (/^\d{2}-\d{2}-\d{4}T\d{2}:\d{2}$/.test(paidAtStr)) {
      // Format: DD-MM-YYYYTHH:mm → convert to ISO
      const [datePart, timePart] = paidAtStr.split("T");
      const [day, month, year] = datePart.split("-");
      paidAt = new Date(`${year}-${month}-${day}T${timePart}:00Z`);
    } else {
      paidAt = new Date(paidAtStr);
    }

    const endDate = new Date(paidAt);
    endDate.setDate(endDate.getDate() + durationWeeks * 7);

    if (endDate < today) {
      TrainerSessionCompletedData.push(session);
    } else {
      TrainerSessionActiveData.push(session);
    }
  });

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
