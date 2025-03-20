import PropTypes from "prop-types";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TierResetDetails = ({
  paymentData,
  daysPassed,
  amountUsed,
  remainingAmount,
  refundAmount,
}) => {
  // Use the first payment entry for display
  const payment = paymentData[0];
  // Initialize Axios instance for API calls
  const axiosPublic = useAxiosPublic();

  // Determine if penalties apply (i.e. if more than 3 days have passed)
  const hasPenalty = daysPassed > 3;
  // Calculate full refund if no penalty applies
  const fullRefund = payment.totalPrice.toFixed(2);

  // Handler for confirming refund request using Stripe refund endpoint
  const handleConfirm = async () => {
    try {
      // Use the calculated refund amount if penalty applies; otherwise full refund
      const refundValue = hasPenalty ? refundAmount : fullRefund;
      const response = await axiosPublic.post("/stripe/refund", {
        stripePaymentID: payment.stripePaymentID,
        refundAmount: parseFloat(refundValue),
      });

      if (response.data.success) {
        alert("Refund request submitted successfully!");
      } else {
        alert("Refund request failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Refund Error:", error);
      alert("Refund request error: " + error.message);
    }
  };

  console.log(payment);

  return (
    <div className="px-4 py-4">
      {/* Payment & Refund Details */}
      <div className="p-4 bg-[#f9fafb] border text-black rounded-lg shadow-md">
        {/* Title */}
        <h3 className="text-center text-black font-semibold text-xl">
          Refund Amount Breakdown
        </h3>
        {hasPenalty ? (
          <div className="mt-2 text-center text-sm bg-red-500 py-2 text-white">
            3 days have passed, so penalties will apply.
          </div>
        ) : (
          <div className="mt-2 text-center text-sm bg-green-500 py-2 text-white">
            Full refund available. No penalties applied.
          </div>
        )}

        {/* Status and Duration */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Current Tier:</p>
            <p className="text-black font-semibold">{payment?.tier}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Duration:</p>
            <p className="text-black font-semibold">{payment?.duration}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Exp Date:</p>
            <p className="text-black font-semibold">{payment?.endDate}</p>
          </div>
        </div>

        {/* Product and Refund Calculation */}
        <div className="space-y-2 mt-5">
          <div className="flex justify-between font-bold px-2">
            <p className="text-md">Product</p>
            <p className="text-md">Price</p>
          </div>
          <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
            <p className="text-md">{payment.tier} Tier Upgrade</p>
            <p className="text-md">${payment.totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-semibold px-2">
            <p className="text-md">Total Paid</p>
            <p className="text-md">${payment.totalPrice.toFixed(2)}</p>
          </div>

          {hasPenalty && (
            <>
              {/* Days Passed Deduction */}
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Days Passed ({daysPassed} days)</p>
                <p className="text-md">- ${amountUsed.toFixed(2)}</p>
              </div>

              {/* Late Refund Fee (10%) */}
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Late Refund Fee (10%)</p>
                <p className="text-md">
                  - ${(remainingAmount * 0.1).toFixed(2)}
                </p>
              </div>
            </>
          )}

          {/* Final Refund Amount */}
          <div className="flex justify-between font-semibold text-[#22c55e] px-2">
            <p className="text-md">Refund Amount</p>
            <p className="text-md font-bold">
              ${hasPenalty ? refundAmount : fullRefund}
            </p>
          </div>
        </div>

        {/* Confirm Refund Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-linear-to-bl hover:bg-linear-to-tr from-red-400 to-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all cursor-pointer"
            onClick={handleConfirm}
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

TierResetDetails.propTypes = {
  paymentData: PropTypes.array.isRequired,
  daysPassed: PropTypes.number.isRequired,
  amountUsed: PropTypes.number.isRequired,
  remainingAmount: PropTypes.number.isRequired,
  refundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default TierResetDetails;
