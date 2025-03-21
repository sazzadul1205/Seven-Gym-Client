import PropTypes from "prop-types";
import { useState } from "react";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

const TierResetDetails = ({
  remainingAmount,
  linkedReceptID,
  refundAmount,
  paymentData,
  setRefundID, 
  daysPassed,
  amountUsed,
  refundReason,
}) => {
  const axiosPublic = useAxiosPublic();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);

  // Exit early if no payment data is available.
  if (!paymentData || paymentData.length === 0) return null;

  // Use the first payment entry.
  const payment = paymentData[0];

  // Determine if penalties apply and compute the refund value.
  const hasPenalty = daysPassed > 3;
  const fullRefund = parseFloat(payment.totalPrice).toFixed(2);
  const computedRefundValue = hasPenalty ? refundAmount : fullRefund;

  // Generate a unique Refund ID using user email, current date, and random digits.
  const generateRefundID = (userEmail) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits.
    const currentDate = new Date()
      .toLocaleDateString("en-GB") // Format: DD/MM/YYYY.
      .split("/")
      .join(""); // Convert to DDMMYYYY format.
    return `TUR${currentDate}${userEmail}${randomDigits}`;
  };

  // Get current date and time in "DD-MM-YYYY HH:MM:SS" format.
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based.
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // Process the refund request when the user confirms in our custom prompt.
  const processRefund = async () => {
    try {
      setIsProcessing(true);

      // Call the API to initiate a refund request.
      const response = await axiosPublic.post("/Stripe_Refund_Intent", {
        stripePaymentID: payment.stripePaymentID,
        refundAmount: parseFloat(computedRefundValue),
      });

      if (response.data.success) {
        // Generate a unique refund ID.
        const refundID = generateRefundID(payment?.email);
        const todayDateTime = getCurrentDateTime();

        // Post refund details to the server.
        await axiosPublic.post("/Tier_Upgrade_Refund", {
          RefundID: refundID,
          linkedPaymentReceptID: linkedReceptID,
          stripeRefundID: response.data.refundID,
          email: payment?.email,
          totalPrice: payment?.totalPrice,
          refundAmount: computedRefundValue,
          refundedReason: refundReason || "No reason provided",
          refunded: true,
          dateTime: todayDateTime,
        });

        // Update user data to reset the tier details.
        await axiosPublic.put("/Users/Update_User_Tier", {
          email: payment?.email,
          tier: "Bronze",
          duration: "",
          updateTierStart: "",
          updateTierEnd: "",
          linkedReceptID: "",
        });

        // Save the generated refund ID.
        setRefundID(refundID);
        // Close the current modal and open the receipt modal.
        document.getElementById("Tear_Reset_To_Bronze_Modal").close();
        document.getElementById("Tear_Reset_Recept").showModal();
      } else {
        throw new Error(response.data.message || "Refund request failed.");
      }
    } catch (error) {
      console.error("Refund Error:", error);
    } finally {
      setIsProcessing(false);
      setShowConfirmPrompt(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="p-4 bg-[#f9fafb] border text-black rounded-lg shadow-md">
        {/* Confirmation Prompt */}
        {showConfirmPrompt && (
          <div className="p-4 bg-yellow-200 border border-yellow-400 text-black rounded mb-4">
            <p className="mb-2 font-semibold text-center">
              Are you sure you want to request a refund?
            </p>
            <div className="flex justify-between space-x-2">
              <button
                onClick={processRefund}
                className="bg-linear-to-bl hover:bg-linear-to-tr from-green-400 to-green-600 text-white px-8 py-2 rounded-xl cursor-pointer"
                disabled={isProcessing}
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmPrompt(false)}
                className="bg-linear-to-bl hover:bg-linear-to-tr from-red-400 to-red-600 text-white px-8 py-2 rounded-xl cursor-pointer"
                disabled={isProcessing}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Refund Breakdown Title */}
        <h3 className="text-center text-black font-semibold text-xl">
          Refund Amount Breakdown
        </h3>

        {/* Penalty Status Message */}
        {hasPenalty ? (
          <div className="mt-2 text-center text-sm bg-red-500 py-2 text-white">
            3 days have passed, so penalties will apply.
          </div>
        ) : (
          <div className="mt-2 text-center text-sm bg-green-500 py-2 text-white">
            Full refund available. No penalties applied.
          </div>
        )}

        {/* Payment Details */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Current Tier:</p>
            <p className="text-black font-semibold">{payment?.tier || "N/A"}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Duration:</p>
            <p className="text-black font-semibold">
              {payment?.duration || "N/A"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Exp Date:</p>
            <p className="text-black font-semibold">
              {payment?.endDate || "N/A"}
            </p>
          </div>
        </div>

        {/* Refund Calculation Breakdown */}
        <div className="space-y-2 mt-5">
          <div className="flex justify-between font-bold px-2">
            <p className="text-md">Product</p>
            <p className="text-md">Price</p>
          </div>
          <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
            <p className="text-md">{payment.tier} Tier Upgrade</p>
            <p className="text-md">
              ${parseFloat(payment.totalPrice).toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between font-semibold px-2">
            <p className="text-md">Total Paid</p>
            <p className="text-md">
              ${parseFloat(payment.totalPrice).toFixed(2)}
            </p>
          </div>

          {hasPenalty && (
            <>
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Days Passed ({daysPassed} days)</p>
                <p className="text-md">- ${Number(amountUsed).toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Late Refund Fee (10%)</p>
                <p className="text-md">
                  - ${(Number(remainingAmount) * 0.1).toFixed(2)}
                </p>
              </div>
            </>
          )}

          <div className="flex justify-between font-semibold text-[#22c55e] px-2">
            <p className="text-md">Refund Amount</p>
            <p className="text-md font-bold">${computedRefundValue}</p>
          </div>
        </div>

        {/* Confirm Refund Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all cursor-pointer"
            onClick={() => setShowConfirmPrompt(true)}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm & Submit"}
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
  setRefundID: PropTypes.func.isRequired, 
  refundReason: PropTypes.string.isRequired,
  remainingAmount: PropTypes.number.isRequired,
  refundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  linkedReceptID: PropTypes.string.isRequired,
};

export default TierResetDetails;
