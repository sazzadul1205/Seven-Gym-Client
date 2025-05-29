/* eslint-disable react/prop-types */

import AllActiveInvoices from "./AllActiveInvoices/AllActiveInvoices";
import AllCompleatInvoices from "./AllCompleatInvoices/AllCompleatInvoices";
import AllPayedInvoices from "./AllPayedInvoices/AllPayedInvoices";
import AllRefundedInvoices from "./AllRefundedInvoices/AllRefundedInvoices";

// Helper to parse 'dd-mm-yyyy' to a valid JS Date
const parseDate = (str) => {
  const [day, month, year] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const TierUpgradeInvoices = ({
  TierUpgradePaymentData,
  TierUpgradeRefundData,
}) => {
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
  const activePayments = nonRefundedPayments?.filter((payment) => {
    const endDate = parseDate(payment.endDate);
    return endDate >= today;
  });

  const completedPayments = nonRefundedPayments?.filter((payment) => {
    const endDate = parseDate(payment.endDate);
    return endDate < today;
  });

  return (
    <div className="text-black space-y-5 pb-5">
      <AllActiveInvoices ActiveTierPaymentData={activePayments} />

      <AllCompleatInvoices CompletedTierPaymentData={completedPayments} />

      <AllPayedInvoices TierUpgradePaymentData={TierUpgradePaymentData} />

      <AllRefundedInvoices TierUpgradeRefundData={TierUpgradeRefundData} />
    </div>
  );
};

export default TierUpgradeInvoices;
