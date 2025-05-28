import PropTypes from "prop-types";
import { useState } from "react";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";
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
  const axiosPublic = useAxiosPublic();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);

  if (!paymentData || paymentData.length === 0) return null;

  // Validate and safely parse totalPrice
  const totalPrice = Number(paymentData?.totalPrice);
  const validTotalPrice = !isNaN(totalPrice) ? totalPrice : 0;

  const hasPenalty = daysPassed > 3;

  // Compute refund value safely
  const parsedRefundAmount = Number(refundAmount);
  const computedRefundValue = hasPenalty
    ? isNaN(parsedRefundAmount)
      ? 0
      : parsedRefundAmount.toFixed(2)
    : validTotalPrice.toFixed(2);

  // Sanitize email for refund ID generation (only alphanumerics)
  const sanitizeEmail = (email) =>
    email ? email.replace(/[^a-z0-9]/gi, "").toUpperCase() : "UNKNOWN";

  const generateRefundID = (userEmail) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .join(""); // DDMMYYYY
    return `TUR${currentDate}${sanitizeEmail(userEmail)}${randomDigits}`;
  };

  const processRefund = async () => {
    try {
      setIsProcessing(true);

      const response = await axiosPublic.post("/Stripe_Refund_Intent", {
        stripePaymentID: paymentData?.stripePaymentID || "",
        refundAmount: parseFloat(computedRefundValue),
      });

      if (response.data.success) {
        const refundID = generateRefundID(paymentData?.email);

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

        await axiosPublic.put("/Users/Update_User_Tier", {
          email: paymentData?.email || "",
          tier: "Bronze",
          duration: "",
          updateTierStart: "",
          updateTierEnd: "",
          linkedReceptID: "",
        });

        setRefundID(refundID);

        // Using DOM methods is fine if your modals are native dialogs,
        // but consider React refs or state for better control.
        const resetModal = document.getElementById(
          "Tear_Reset_To_Bronze_Modal"
        );
        const receiptModal = document.getElementById("Tear_Reset_Recept");

        if (resetModal?.close) resetModal.close();
        if (receiptModal?.showModal) receiptModal.showModal();
      } else {
        throw new Error(response.data.message || "Refund request failed.");
      }
    } catch (error) {
      console.error("Refund Error:", error);
      alert(`Refund failed: ${error.message}`); // Add user-friendly alert
    } finally {
      setIsProcessing(false);
      setShowConfirmPrompt(false);
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="p-4 bg-[#f9fafb] border text-black rounded-lg shadow-md">
        {showConfirmPrompt && (
          <div className="p-4 bg-yellow-200 border border-yellow-400 text-black rounded mb-4">
            <p className="mb-2 font-semibold text-center">
              Are you sure you want to request a refund?
            </p>
            <div className="flex justify-between space-x-2 pt-3">
              <CommonButton
                clickEvent={processRefund}
                text="Yes"
                bgColor="green"
                textColor="text-white"
                px="px-8"
                py="py-2"
                disabled={isProcessing}
              />

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

        <h3 className="text-center text-black font-semibold text-xl">
          Refund Amount Breakdown
        </h3>

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
          <div className="text-center py-2`">
            <p className="text-md">Refund Reason</p>
            <p className="text-md font-bold">{refundReason}</p>
          </div>
        </div>

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
