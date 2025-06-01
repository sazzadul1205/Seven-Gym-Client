import { useMemo } from "react";
import PropTypes from "prop-types";

import TrainerSessionActiveInvoices from "./TrainerSessionActiveInvoices/TrainerSessionActiveInvoices";
import TrainerSessionCompleatInvoices from "./TrainerSessionCompleatInvoices/TrainerSessionCompleatInvoices";
import TrainerSessionPaymentInvoices from "./TrainerSessionPaymentInvoices/TrainerSessionPaymentInvoices";
import TrainerSessionRefundInvoices from "./TrainerSessionRefundInvoices/TrainerSessionRefundInvoices";

const TrainerSessionsInvoices = ({
  TrainerSessionRefundData,
  TrainerSessionPaymentData,
}) => {
  console.log("Trainer Session Refund Data:", TrainerSessionRefundData);
  console.log("Trainer Session Payment Data:", TrainerSessionPaymentData);

  const currentDate = new Date();

  const { activeInvoices, completedInvoices } = useMemo(() => {
    // Get list of refunded stripePaymentIDs
    const refundedPaymentIDs = new Set(
      TrainerSessionRefundData.map((refund) => refund?.PaymentRefund?.stripePaymentID)
    );

    const active = [];
    const completed = [];

    TrainerSessionPaymentData.forEach((payment) => {
      const { stripePaymentID, BookingInfo } = payment;

      // Skip if already refunded
      if (refundedPaymentIDs.has(stripePaymentID)) return;

      // Calculate session end date
      const acceptedAt = new Date(BookingInfo.acceptedAt);
      const durationInMs = BookingInfo.durationWeeks * 7 * 24 * 60 * 60 * 1000;
      const endDate = new Date(acceptedAt.getTime() + durationInMs);

      // Determine active or completed
      if (endDate < currentDate) {
        completed.push(payment);
      } else {
        active.push(payment);
      }
    });

    return { activeInvoices: active, completedInvoices: completed };
  }, [TrainerSessionPaymentData, TrainerSessionRefundData, currentDate]);

  return (
    <div className="text-black">
      <TrainerSessionPaymentInvoices TrainerSessionPaymentData={TrainerSessionPaymentData} />

      <TrainerSessionRefundInvoices TrainerSessionRefundData={TrainerSessionRefundData} />

      <TrainerSessionActiveInvoices TrainerSessionActiveData={activeInvoices} />

      <TrainerSessionCompleatInvoices TrainerSessionCompleatedData={completedInvoices} />
    </div>
  );
};

TrainerSessionsInvoices.propTypes = {
  TrainerSessionRefundData: PropTypes.array.isRequired,
  TrainerSessionPaymentData: PropTypes.array.isRequired,
};

export default TrainerSessionsInvoices;
