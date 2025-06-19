/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import AllPayedInvoices from "./AllPayedInvoices/AllPayedInvoices";
import AllActiveInvoices from "./AllActiveInvoices/AllActiveInvoices";
import AllCompleatInvoices from "./AllCompleatInvoices/AllCompleatInvoices";
import AllRefundedInvoices from "./AllRefundedInvoices/AllRefundedInvoices";
import TierUpgradeChart from "./TierUpgradeChart/TierUpgradeChart";

// Helper to parse 'dd-mm-yyyy' to a valid JS Date
const parseDate = (str) => {
  const [day, month, year] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const TABS = [
  { key: "active", label: "Active Invoices" },
  { key: "completed", label: "Completed Invoices" },
  { key: "paid", label: "All Paid Invoices" },
  { key: "refunded", label: "Refunded Invoices" },
];

const TierUpgradeInvoices = ({
  DailyTierUpgradePaymentData,
  DailyTierUpgradeRefundData,
  TierUpgradePaymentData,
  TierUpgradeRefundData,
}) => {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(false);

  // Create a Set of refunded payment IDs
  const refundedPaymentIDs = new Set(
    TierUpgradeRefundData?.map((refund) => refund.linkedPaymentReceptID)
  );

  const today = new Date();

  // Filter out refunded payments
  const nonRefundedPayments = TierUpgradePaymentData?.filter(
    (payment) => !refundedPaymentIDs.has(payment.paymentID)
  );

  // Split into active and completed
  const ActiveTierPaymentData = nonRefundedPayments?.filter((payment) => {
    const endDate = parseDate(payment.endDate);
    return endDate >= today;
  });

  const CompletedTierPaymentData = nonRefundedPayments?.filter((payment) => {
    const endDate = parseDate(payment.endDate);
    return endDate < today;
  });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return (
          <AllActiveInvoices ActiveTierPaymentData={ActiveTierPaymentData} />
        );
      case "completed":
        return (
          <AllCompleatInvoices
            CompletedTierPaymentData={CompletedTierPaymentData}
          />
        );
      case "paid":
        return (
          <AllPayedInvoices TierUpgradePaymentData={TierUpgradePaymentData} />
        );
      case "refunded":
        return (
          <AllRefundedInvoices TierUpgradeRefundData={TierUpgradeRefundData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-black space-y-1 pb-5">
      <TierUpgradeChart
        DailyTierUpgradePaymentData={DailyTierUpgradePaymentData}
        DailyTierUpgradeRefundData={DailyTierUpgradeRefundData}
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

export default TierUpgradeInvoices;
