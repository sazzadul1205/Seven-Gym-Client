import { useRef } from "react";
import { Link, useParams } from "react-router";

// Import Package
import { jsPDF } from "jspdf";
import PropTypes from "prop-types";
import domToImage from "dom-to-image";
import { useQuery } from "@tanstack/react-query";

// Import Utility
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

const TierResetRecept = ({ refundID }) => {
  const axiosPublic = useAxiosPublic();
  const refundRef = useRef();
  const { email } = useParams();

  // Fetch refund data using
  const {
    data: TierUpgradeRefundData = [],
    isLoading: TierUpgradeRefundLoading,
    error: TierUpgradeRefundError,
  } = useQuery({
    queryKey: ["TierUpgradeRefundData", refundID],
    queryFn: () =>
      refundID
        ? axiosPublic
            .get(`/Tier_Upgrade_Refund/search?refundID=${refundID}`)
            .then((res) => res.data)
        : Promise.reject(new Error("No Refund ID found")),
    enabled: !!refundID,
  });

  // Fetch payment data based on linked payment ID
  const LinkedPaymentID = TierUpgradeRefundData[0]?.linkedPaymentReceptID;

  // Fetch Payment data
  const {
    data: TierUpgradePaymentData = [],
    isLoading: TierUpgradePaymentLoading,
    error: TierUpgradePaymentError,
  } = useQuery({
    queryKey: ["TierUpgradePaymentData", LinkedPaymentID],
    queryFn: () =>
      LinkedPaymentID
        ? axiosPublic
            .get(`/Tier_Upgrade_Payment/search?paymentID=${LinkedPaymentID}`)
            .then((res) => res.data)
        : Promise.reject(new Error("No payment ID found")),
    enabled: !!LinkedPaymentID,
  });

  // Handle loading and errors
  if (TierUpgradeRefundLoading || TierUpgradePaymentLoading) return <Loading />;
  if (TierUpgradeRefundError || TierUpgradePaymentError)
    return <FetchingError />;

  // Extract payment and refund data
  const payment = TierUpgradePaymentData[0] || {};
  const refund = TierUpgradeRefundData[0] || {};

  // Helper function to parse dates
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  // Fetch Date & Time
  const parseDateTime = (dateTimeString) => {
    const [datePart] = dateTimeString.split(" ");
    return parseDate(datePart);
  };

  // Initialize calculation variables
  let daysPassed = 0;
  let amountUsed = 0;
  let remainingAmount = 0;
  let computedRefundValue = 0;
  let hasPenalty = false;

  // Perform calculations if dates are available
  if (payment.startDate && refund.dateTime) {
    try {
      const startDate = parseDate(payment.startDate);
      const refundDate = parseDateTime(refund.dateTime);

      // Calculate days passed
      daysPassed = Math.floor((refundDate - startDate) / (1000 * 60 * 60 * 24));

      // Calculate refund breakdown
      const totalPrice = payment.totalPrice;
      const durationMonths = parseInt(payment.duration.split(" ")[0], 10);
      const totalDays = durationMonths * 30;
      const perDayCost = totalPrice / totalDays;

      amountUsed = daysPassed * perDayCost;
      remainingAmount = totalPrice - amountUsed;
      hasPenalty = daysPassed > 3;

      computedRefundValue = hasPenalty
        ? (remainingAmount * 0.9).toFixed(2)
        : totalPrice.toFixed(2);
    } catch (error) {
      console.error("Error calculating refund:", error);
    }
  }

  // Generate PDF from the receipt content
  const generatePDF = async () => {
    if (!refundRef.current) return;

    try {
      const blob = await domToImage.toBlob(refundRef.current);
      const imgData = URL.createObjectURL(blob);

      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        // Measure image size
        const pxToMm = (px) => px * 0.264583; // convert px to mm (1px = 0.264583mm)

        const imgWidthPx = img.width;
        const imgHeightPx = img.height;

        const pdfWidth = 80; // POS paper width in mm (commonly 58 or 80)
        const pdfHeight = pxToMm(imgHeightPx) * (pdfWidth / pxToMm(imgWidthPx)); // maintain aspect ratio

        const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);

        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`RefundSessionReceipt_${payment?.paymentID}.pdf`);

        URL.revokeObjectURL(imgData); // Clean up
      };
    } catch (error) {
      console.error("Error generating POS PDF:", error);
    }
  };

  return (
    <div className="modal-box bg-[#ffffff] shadow-lg rounded-lg max-w-md mx-auto">
      {/* Receipt Section */}
      <div ref={refundRef} id="Refund">
        {/* Receipt Header */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-[#1f2937]">Seven Gym</h4>
          <p className="text-sm text-[#6b7280]">Tier Upgrade Refund Receipt</p>
          <p className="text-sm text-[#6b7280]">www.SevenGym.com</p>
        </div>

        {/* Receipt Details */}
        <div className="p-4 bg-[#f9fafb] border text-black">
          {/* Top Part */}
          <div className="pb-1 text-center border-b">
            <p className="text-sm text-[#6b7280]">
              Receipt #: SG-TURR-
              <span>{TierUpgradeRefundData[0]?.RefundID}</span>
            </p>
            <p className="text-sm font-semibold text-[#6b7280]">
              Customer: <span>{TierUpgradeRefundData[0]?.email}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Transaction ID: TX-{" "}
              <span>{TierUpgradeRefundData[0]?.RefundID?.slice(-6)}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Date & Time : <span>{TierUpgradeRefundData[0]?.dateTime}</span>
            </p>
          </div>

          {/* Tier Details */}
          <div className="px-4 py-4">
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Refunded Tier:</p>
              <p className="text-black font-semibold">
                {payment?.tier || "N/A"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Refunded Duration:</p>
              <p className="text-black font-semibold">
                {payment?.duration || "N/A"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Refunded Exp Date:</p>
              <p className="text-black font-semibold">
                {payment?.endDate || "N/A"}
              </p>
            </div>
          </div>

          {/* Refund Breakdown */}
          <div className="px-4 py-4 space-y-2">
            <div className="flex justify-between font-bold px-2">
              <p className="text-md">Product</p>
              <p className="text-md">Price</p>
            </div>
            <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
              <p className="text-md">{payment?.tier} Tier Upgrade</p>
              <p className="text-md">
                ${parseFloat(payment?.totalPrice).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between font-semibold px-2">
              <p className="text-md">Total Paid</p>
              <p className="text-md">
                ${parseFloat(payment?.totalPrice).toFixed(2)}
              </p>
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
              <p className="text-md font-bold">${computedRefundValue}</p>
            </div>
          </div>

          {/* Refund Reason */}
          <div className="px-4 py-4 border-t border-gray-300">
            <p className="text-sm font-semibold">Refund Reason:</p>
            <p className="text-sm text-[#6b7280]">{refund?.refundedReason}</p>
          </div>

          {/* Thank You Message */}
          <div className="text-center border-t pt-4">
            <p className="text-sm text-[#6b7280]">
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>
        </div>
      </div>

      {/* Close Button and PDF Generation Button */}
      <div className="modal-action mt-6 flex justify-between">
        {/* Close Button */}
        <form method="dialog">
          <Link to={`/User/TierUpgrade/${email}`}>
            <button className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-400 to-blue-600 rounded-xl py-3 w-[150px] font-semibold cursor-pointer">
              Close
            </button>
          </Link>
        </form>

        {/* PDF Generate Button  */}
        {payment && (
          <button
            onClick={generatePDF}
            className="bg-linear-to-bl hover:bg-linear-to-tr from-green-400 to-green-600 rounded-xl py-3 w-[150px] font-semibold cursor-pointer"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

// Add PropTypes to validate props
TierResetRecept.propTypes = {
  refundID: PropTypes.string,
};

export default TierResetRecept;
