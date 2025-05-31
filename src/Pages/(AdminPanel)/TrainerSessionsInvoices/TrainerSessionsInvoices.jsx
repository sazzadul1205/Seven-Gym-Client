/* eslint-disable react/prop-types */
import TrainerSessionPaymentInvoice from "./TrainerSessionPaymentInvoice/TrainerSessionPaymentInvoice";
import TrainerSessionRefundInvoice from "./TrainerSessionRefundInvoice/TrainerSessionRefundInvoice";

const TrainerSessionsInvoices = ({
  TrainerSessionRefundData,
  TrainerSessionPaymentData,
}) => {
  return (
    <div className="text-black">
      <TrainerSessionPaymentInvoice
        TrainerSessionPaymentData={TrainerSessionPaymentData}
      />

      <TrainerSessionRefundInvoice
        TrainerSessionRefundData={TrainerSessionRefundData}
      />
    </div>
  );
};

export default TrainerSessionsInvoices;
