/* eslint-disable react/prop-types */

import { useState } from "react";
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

  console.log("Daily Tier Upgrade Payment Data", DailyTierUpgradePaymentData);
  console.log("Daily Tier Upgrade Refund Data", DailyTierUpgradeRefundData);

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

  return (
    <div className="text-black space-y-5 pb-5">
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

      {/* Tab Content */}
      <div>
        {activeTab === "active" && (
          <AllActiveInvoices ActiveTierPaymentData={ActiveTierPaymentData} />
        )}
        {activeTab === "completed" && (
          <AllCompleatInvoices
            CompletedTierPaymentData={CompletedTierPaymentData}
          />
        )}
        {activeTab === "paid" && (
          <AllPayedInvoices TierUpgradePaymentData={TierUpgradePaymentData} />
        )}
        {activeTab === "refunded" && (
          <AllRefundedInvoices TierUpgradeRefundData={TierUpgradeRefundData} />
        )}
      </div>
    </div>
  );
};

export default TierUpgradeInvoices;
