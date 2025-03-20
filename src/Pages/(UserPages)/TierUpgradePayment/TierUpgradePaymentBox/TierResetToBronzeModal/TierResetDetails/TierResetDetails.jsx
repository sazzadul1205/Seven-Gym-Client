import PropTypes from "prop-types";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

const TierResetDetails = ({
  paymentData,
  daysPassed,
  amountUsed,
  remainingAmount,
  refundAmount,
}) => {
  const axiosPublic = useAxiosPublic();
  if (!paymentData || paymentData.length === 0) return null; // Avoids errors

  const payment = paymentData[0]; // Use first payment entry

  const hasPenalty = daysPassed > 3;
  const fullRefund = parseFloat(payment.totalPrice).toFixed(2);
  const refundValue = hasPenalty ? refundAmount : fullRefund;

  const generateRefundID = (userEmail) => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
    const currentDate = new Date()
      .toLocaleDateString("en-GB") // Format: DD/MM/YYYY
      .split("/")
      .join(""); // Convert to DDMMYYYY format

    return `TUR${currentDate}${userEmail}${randomDigits}`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleConfirm = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to request a refund?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "No, cancel",
      });

      if (!result.isConfirmed) return;

      const refundValue = hasPenalty ? refundAmount : fullRefund;

      // Initiate refund request
      const response = await axiosPublic.post("/Stripe_Refund_Intent", {
        stripePaymentID: payment.stripePaymentID,
        refundAmount: parseFloat(refundValue),
      });

      if (response.data.success) {
        const refundID = generateRefundID(payment?.email);
        const todayDateTime = getCurrentDateTime();

        // Store refund details
        await axiosPublic.post("/Tier_Upgrade_Refund", {
          RefundID: refundID,
          stripeRefundID: response.data.refundID,
          email: payment?.email,
          totalPrice: payment.totalPrice,
          refundAmount: refundValue,
          Payed: true,
          dateTime: todayDateTime,
        });

        // Update user data
        await axiosPublic.put("/Users/Update_User_Tier", {
          email: payment?.email,
          tier: "Bronze",
          duration: "",
          updateTierStart: "",
          updateTierEnd: "",
          linkedReceptID: "",
        });

        await Swal.fire(
          "Success",
          "Refund request submitted successfully!",
          "success"
        );
      } else {
        throw new Error(response.data.message || "Refund request failed.");
      }
    } catch (error) {
      console.error("Refund Error:", error);
      await Swal.fire(
        "Error",
        `Refund request error: ${error.message}`,
        "error"
      );
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="p-4 bg-[#f9fafb] border text-black rounded-lg shadow-md">
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
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Days Passed ({daysPassed} days)</p>
                <p className="text-md">- ${amountUsed.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-semibold text-red-500 px-2">
                <p className="text-md">Late Refund Fee (10%)</p>
                <p className="text-md">
                  - ${(remainingAmount * 0.1).toFixed(2)}
                </p>
              </div>
            </>
          )}

          <div className="flex justify-between font-semibold text-[#22c55e] px-2">
            <p className="text-md">Refund Amount</p>
            <p className="text-md font-bold">${refundValue}</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all cursor-pointer"
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
