import { useRef } from "react";
import { Link, useParams } from "react-router";

// Import Package
import { jsPDF } from "jspdf";
import PropTypes from "prop-types";
import domToImage from "dom-to-image";
import { useQuery } from "@tanstack/react-query";

// Import Hooks
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

  console.log(TierUpgradeRefundData);

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
  if (TierUpgradePaymentData.startDate && TierUpgradeRefundData.dateTime) {
    try {
      const startDate = parseDate(TierUpgradePaymentData.startDate);
      const refundDate = parseDateTime(TierUpgradeRefundData.dateTime);

      // Calculate days passed
      daysPassed = Math.floor((refundDate - startDate) / (1000 * 60 * 60 * 24));

      // Calculate refund breakdown
      const totalPrice = TierUpgradePaymentData.totalPrice;
      const durationMonths = parseInt(
        TierUpgradePaymentData.duration.split(" ")[0],
        10
      );
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
        pdf.save(
          `RefundSessionReceipt_${TierUpgradePaymentData?.paymentID}.pdf`
        );

        URL.revokeObjectURL(imgData); // Clean up
      };
    } catch (error) {
      console.error("Error generating POS PDF:", error);
    }
  };

  // Handle loading and errors
  if (TierUpgradeRefundLoading || TierUpgradePaymentLoading) return <Loading />;
  if (TierUpgradeRefundError || TierUpgradePaymentError)
    return <FetchingError />;

  return (
    <div className="modal-box bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <div ref={refundRef} id="Refund">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-gray-900">Seven Gym</h4>
          <p className="text-sm text-gray-500">Tier Upgrade Refund Receipt</p>
          <p className="text-sm text-gray-500">www.SevenGym.com</p>
        </div>

        {/* Details */}
        <div className="p-4 bg-gray-50 border text-black">
          <div className="text-center border-b pb-1">
            <p className="text-sm text-gray-500">
              Receipt #: SG-TURR-{TierUpgradeRefundData[0]?.RefundID}
            </p>
            <p className="text-sm font-semibold text-gray-500">
              Customer: {TierUpgradeRefundData[0]?.email}
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID: TX-{TierUpgradeRefundData[0]?.RefundID?.slice(-6)}
            </p>
            <p className="text-sm text-gray-500">
              Date & Time : {TierUpgradeRefundData[0]?.dateTime}
            </p>
          </div>

          {/* Tier Info */}
          <div className="py-4 space-y-1">
            {[
              { label: "Refunded Tier", value: TierUpgradePaymentData?.tier },
              {
                label: "Refunded Duration",
                value: TierUpgradePaymentData?.duration,
              },
              {
                label: "Refunded Exp Date",
                value: TierUpgradePaymentData?.endDate,
              },
            ].map((item, i) => (
              <div key={i} className="flex justify-between px-4">
                <p className="text-sm font-semibold">{item.label}:</p>
                <p className="text-black font-semibold">
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>

          {/* Refund Breakdown */}
          <div className="py-4 space-y-2 px-2">
            <div className="flex justify-between font-bold">
              <p className="text-md">Product</p>
              <p className="text-md">Price</p>
            </div>
            <div className="flex justify-between font-semibold border-b border-gray-400 pb-2">
              <p className="text-md">
                {TierUpgradePaymentData?.tier} Tier Upgrade
              </p>
              <p className="text-md">
                ${parseFloat(TierUpgradePaymentData?.totalPrice).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between font-semibold">
              <p className="text-md">Total Paid</p>
              <p className="text-md">
                ${parseFloat(TierUpgradePaymentData?.totalPrice).toFixed(2)}
              </p>
            </div>

            {hasPenalty && (
              <>
                <div className="flex justify-between font-semibold text-red-500">
                  <p className="text-md">Days Passed ({daysPassed} days)</p>
                  <p className="text-md">- ${amountUsed.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-semibold text-red-500">
                  <p className="text-md">Late Refund Fee (10%)</p>
                  <p className="text-md">
                    - ${(remainingAmount * 0.1).toFixed(2)}
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-between font-semibold text-green-500">
              <p className="text-md">Refund Amount</p>
              <p className="text-md font-bold">${computedRefundValue}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="px-4 py-4 border-t border-gray-300">
            <p className="text-sm font-semibold">Refund Reason:</p>
            <p className="text-sm text-gray-500">
              {TierUpgradeRefundData?.refundedReason}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-4">
            <p className="text-sm text-gray-500">
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="modal-action mt-6 flex justify-between">
        <form method="dialog">
          <Link to={`/User/TierUpgrade/${email}`}>
            <button className="bg-gradient-to-bl from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-xl py-3 w-[150px] font-semibold">
              Close
            </button>
          </Link>
        </form>
        {TierUpgradePaymentData && (
          <button
            onClick={generatePDF}
            className="bg-gradient-to-bl from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-xl py-3 w-[150px] font-semibold"
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
