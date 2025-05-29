import PropTypes from "prop-types";
import { useState } from "react";

// import Hooks
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

// Import Button
import CommonButton from "../../../../../../Shared/Buttons/CommonButton";

const TierResetDetails = ({
  amountUsed,
  daysPassed,
  paymentData,
  setRefundID,
  refundAmount,
  refundReason,
  linkedReceptID,
  remainingAmount,
}) => {
  // Get an instance of the Axios public client (custom hook)
  const axiosPublic = useAxiosPublic();

  // Local state to manage refund processing and confirmation prompt visibility
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);

  // Guard clause: Do not render the component if payment data is missing
  if (!paymentData) return null;

  // Safely convert totalPrice from string/number to a valid number
  const totalPrice = Number(paymentData?.totalPrice);
  // Use 0 if parsing failed (NaN)
  const validTotalPrice = !isNaN(totalPrice) ? totalPrice : 0;

  // Determine if the user is subject to a penalty based on days passed
  const hasPenalty = daysPassed > 3;

  // Safely parse refundAmount (could be string/number)
  // If under penalty, use manually calculated refund; else return full amount
  const parsedRefundAmount = Number(refundAmount);
  const computedRefundValue = hasPenalty
    ? isNaN(parsedRefundAmount)
      ? 0
      : parsedRefundAmount.toFixed(2)
    : validTotalPrice.toFixed(2);

  // Function to clean email address and make it safe for ID generation
  const sanitizeEmail = (email) =>
    email ? email.replace(/[^a-z0-9]/gi, "").toUpperCase() : "UNKNOWN";

  // Generate a unique refund ID using sanitized email and current date
  const generateRefundID = (userEmail) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .join(""); // Format: DDMMYYYY
    return `TUR${currentDate}${sanitizeEmail(userEmail)}${randomDigits}`;
  };

  // Main function to process the refund and reset user tier
  const processRefund = async () => {
    try {
      setIsProcessing(true); // Disable buttons or show loader during process

      // Step 1: Create a refund intent with Stripe
      const response = await axiosPublic.post("/Stripe_Refund_Intent", {
        stripePaymentID: paymentData?.stripePaymentID || "",
        refundAmount: parseFloat(computedRefundValue),
      });

      if (response.data.success) {
        // Step 2: Generate refund ID
        const refundID = generateRefundID(paymentData?.email);

        // Step 3: Log refund details in your own database
        await axiosPublic.post("/Tier_Upgrade_Refund", {
          RefundID: refundID,
          linkedPaymentReceptID: linkedReceptID,
          stripeRefundID: response.data.refundID,
          email: paymentData?.email || "",
          totalPrice: validTotalPrice,
          refundAmount: parseFloat(computedRefundValue),
          refundedReason: refundReason || "No reason provided",
          refunded: true,
          paymentTime: new Date().toISOString(),
        });

        // Step 4: Downgrade user tier in your system
        await axiosPublic.put("/Users/Update_User_Tier", {
          email: paymentData?.email || "",
          tier: "Bronze",
          duration: "",
          updateTierStart: "",
          updateTierEnd: "",
          linkedReceptID: "",
        });

        // Step 5: Update parent component with refund ID
        setRefundID(refundID);

        // Optional UI updates: close tier reset modal and open receipt modal
        document.getElementById("Tear_Reset_To_Bronze_Modal").close();
        document.getElementById("Tear_Reset_Recept").showModal();
      } else {
        // Handle API error response
        throw new Error(response.data.message || "Refund request failed.");
      }
    } catch (error) {
      // Log and show error to user
      console.error("Refund Error:", error);
      alert(`Refund failed: ${error.message}`);
    } finally {
      // Cleanup: reset UI state
      setIsProcessing(false);
      setShowConfirmPrompt(false);
    }
  };

  return (
    <div className="px-4 py-4">
      {/* Container card */}
      <div className="p-4 bg-[#f9fafb] border text-black rounded-lg shadow-md">
        {/* Confirm refund prompt */}
        {showConfirmPrompt && (
          <div className="p-4 bg-yellow-200 border border-yellow-400 text-black rounded mb-4">
            <p className="mb-2 font-semibold text-center">
              Are you sure you want to request a refund?
            </p>
            <div className="flex justify-between space-x-2 pt-3">
              {/* Confirm refund button */}
              <CommonButton
                clickEvent={processRefund}
                text="Yes"
                bgColor="green"
                textColor="text-white"
                px="px-8"
                py="py-2"
                disabled={isProcessing}
              />
              {/* Cancel refund prompt */}
              <CommonButton
                clickEvent={() => setShowConfirmPrompt(false)}
                text="No"
                bgColor="red"
                textColor="text-white"
                px="px-8"
                py="py-2"
                disabled={isProcessing}
              />
            </div>
          </div>
        )}

        {/* Refund Title */}
        <h3 className="text-center text-black font-semibold text-xl">
          Refund Amount Breakdown
        </h3>

        {/* Penalty Notice */}
        {hasPenalty ? (
          <div className="block mt-2 text-center text-sm bg-red-500 py-2 text-white">
            <p>3 Days have passed, so penalties will apply.</p>
            <p>Time Passed: {daysPassed} Days</p>
          </div>
        ) : (
          <div className="mt-2 text-center text-sm bg-green-500 py-2 text-white">
            Full refund available. No penalties applied.
          </div>
        )}

        {/* Tier Information */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Current Tier:</p>
            <p className="text-black font-semibold">
              {paymentData?.tier || "N/A"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Duration:</p>
            <p className="text-black font-semibold">
              {paymentData?.duration || "N/A"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Exp Date:</p>
            <p className="text-black font-semibold">
              {paymentData?.endDate || "N/A"}
            </p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 mt-5">
          <div className="flex justify-between font-bold px-2">
            <p className="text-md">Product</p>
            <p className="text-md">Price</p>
          </div>
          <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
            <p className="text-md">{paymentData?.tier} Tier Upgrade</p>
            <p className="text-md">${validTotalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-semibold px-2">
            <p className="text-md">Total Paid</p>
            <p className="text-md">${validTotalPrice.toFixed(2)}</p>
          </div>

          {/* Conditional penalties if refund is late */}
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

          {/* Final refund value */}
          <div className="flex justify-between font-semibold text-[#22c55e] px-2">
            <p className="text-md">Refund Amount</p>
            <p className="text-md font-bold">${computedRefundValue}</p>
          </div>

          {/* Refund Reason */}
          <div className="text-center py-2">
            <p className="text-md">Refund Reason</p>
            <p className="text-md font-bold">{refundReason}</p>
          </div>
        </div>

        {/* Submit refund button */}
        <div className="flex justify-center mt-6">
          <CommonButton
            clickEvent={() => setShowConfirmPrompt(true)}
            text="Confirm & Submit"
            bgColor="DarkRed"
            textColor="text-white font-bold"
            px="px-8"
            py="py-3"
            borderRadius="rounded-lg"
            width="auto"
            isLoading={isProcessing}
            loadingText="Processing..."
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

// Prop Validation
TierResetDetails.propTypes = {
  paymentData: PropTypes.shape({
    tier: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    stripePaymentID: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
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
