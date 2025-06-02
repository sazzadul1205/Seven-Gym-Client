/* eslint-disable react/prop-types */

import TrainerSessionActiveInvoices from "./TrainerSessionActiveInvoices/TrainerSessionActiveInvoices";
import TrainerSessionCompletedInvoices from "./TrainerSessionCompletedInvoices/TrainerSessionCompletedInvoices";
import TrainerSessionPaymentInvoices from "./TrainerSessionPaymentInvoices/TrainerSessionPaymentInvoices";
import TrainerSessionRefundInvoices from "./TrainerSessionRefundInvoices/TrainerSessionRefundInvoices";

const TrainerSessionsInvoices = ({
  TrainerSessionRefundData = [],
  TrainerSessionPaymentData = [],
}) => {
  console.log("Trainer Session Refund Data:", TrainerSessionRefundData);
  console.log("Trainer Session Payment Data:", TrainerSessionPaymentData);

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

  return (
    <div className="text-black">
      <TrainerSessionPaymentInvoices
        TrainerSessionPaymentData={TrainerSessionPaymentData}
      />

      <TrainerSessionRefundInvoices
        TrainerSessionRefundData={TrainerSessionRefundData}
      />

      <TrainerSessionActiveInvoices
        TrainerSessionActiveData={TrainerSessionActiveData}
      />

      <TrainerSessionCompletedInvoices
        TrainerSessionCompletedData={TrainerSessionCompletedData}
      />
    </div>
  );
};

export default TrainerSessionsInvoices;
