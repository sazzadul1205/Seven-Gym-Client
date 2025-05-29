import { useRef } from "react";

// Import Package
import { jsPDF } from "jspdf";
import PropTypes from "prop-types";
import domToImage from "dom-to-image";
import { useQuery } from "@tanstack/react-query";

// import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import FetchingError from "../../../../../Shared/Component/FetchingError";

const TierUpgradeRefundInvoiceModal = ({ RefundID, Close }) => {
  // Custom Axios instance for public API calls
  const axiosPublic = useAxiosPublic();

  // Create a reference to the refund section for PDF generation
  const refundRef = useRef();

  // ============================
  // Fetch Refund Data by RefundID
  // ============================
  const {
    data: TierUpgradeRefundData = [],
    isLoading: TierUpgradeRefundLoading,
    error: TierUpgradeRefundError,
  } = useQuery({
    queryKey: ["TierUpgradeRefundData", RefundID], // Unique cache key
    queryFn: async () => {
      if (!RefundID) throw new Error("No Refund ID provided"); // Guard clause
      const response = await axiosPublic.get(
        `/Tier_Upgrade_Refund/search?refundID=${RefundID}`
      );
      return response.data || []; // Default to empty array if no data
    },
    enabled: !!RefundID, // Run query only if RefundID exists
  });

  // Extract first refund record (assuming only one per ID)
  const refundInfo = TierUpgradeRefundData[0];

  // Get the associated payment receipt ID from the refund info
  const LinkedPaymentID = refundInfo?.linkedPaymentReceptID;

  // ================================
  // Fetch Payment Data by paymentID
  // ================================
  const {
    data: TierUpgradePaymentData = {},
    isLoading: TierUpgradePaymentLoading,
    error: TierUpgradePaymentError,
  } = useQuery({
    queryKey: ["TierUpgradePaymentData", LinkedPaymentID],
    queryFn: () =>
      axiosPublic
        .get(`/Tier_Upgrade_Payment/search?paymentID=${LinkedPaymentID}`)
        .then((res) => res.data),
    enabled: !!LinkedPaymentID, // Run only if linked ID is available
  });

  // ==============================
  // Date Parsing Utilities
  // ==============================

  // Parse a date in format "dd-mm-yyyy" into a Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day); // Month is 0-based
  };

  // Extract and parse the date portion from a full datetime string
  const parseDateTime = (dateTimeString) => {
    const [datePart] = dateTimeString.split(" "); // Split datetime into date and time
    return parseDate(datePart); // Reuse existing function
  };

  // ==============================
  // Refund Calculation Logic
  // ==============================
  let daysPassed = 0,
    amountUsed = 0,
    remainingAmount = 0,
    computedRefundValue = 0,
    hasPenalty = false;

  try {
    // Convert start and refund dates to Date objects
    const startDate = parseDate(TierUpgradePaymentData?.startDate || "");
    const refundDate = parseDateTime(refundInfo?.dateTime || "");

    // Calculate number of days between start and refund dates
    daysPassed = Math.floor((refundDate - startDate) / (1000 * 60 * 60 * 24));

    const totalPrice = parseFloat(TierUpgradePaymentData?.totalPrice || 0);

    // Extract number of months from string like "3 months"
    const durationMonths = parseInt(
      TierUpgradePaymentData?.duration?.split(" ")[0] || "1",
      10
    );
    const totalDays = durationMonths * 30; // Assume 30 days per month
    const perDayCost = totalPrice / totalDays;

    // Cost used up till refund date
    amountUsed = daysPassed * perDayCost;
    remainingAmount = totalPrice - amountUsed;

    // Apply penalty if refund is after 3 days
    hasPenalty = daysPassed > 3;

    // Calculate actual refund value (90% refund if penalty applies)
    computedRefundValue = hasPenalty
      ? (remainingAmount * 0.9).toFixed(2)
      : totalPrice.toFixed(2);
  } catch (err) {
    console.error("Refund calculation failed:", err);
  }

  // ==============================
  // Generate PDF from DOM element
  // ==============================
  const generatePDF = async () => {
    if (!refundRef.current) return; // Ensure the element exists

    try {
      // Convert DOM to image blob
      const blob = await domToImage.toBlob(refundRef.current);
      const imgData = URL.createObjectURL(blob); // Create URL from blob

      // Create image object and wait for load
      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        // Convert pixels to millimeters (for jsPDF)
        const pxToMm = (px) => px * 0.264583;
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Define PDF dimensions based on image size
        const pdfWidth = 80;
        const pdfHeight = pxToMm(imgHeight) * (pdfWidth / pxToMm(imgWidth));

        // Create a new PDF document
        const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);

        // Add image to the PDF
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Save the PDF file
        pdf.save(
          `RefundSessionReceipt_${TierUpgradePaymentData?.paymentID}.pdf`
        );

        // Clean up the object URL
        URL.revokeObjectURL(imgData);
      };
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  // ==============================
  // Handle loading or error states
  // ==============================
  if (TierUpgradeRefundLoading || TierUpgradePaymentLoading) return <Loading />;
  if (TierUpgradeRefundError || TierUpgradePaymentError)
    return <FetchingError />;

  return (
    // Modal container for the refund receipt
    <div className="modal-box bg-white shadow-lg rounded-lg max-w-md mx-auto">
      {/* Reference element for generating the PDF */}
      <div ref={refundRef} id="Refund">
        {/* Header section with branding */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-gray-900">Seven Gym</h4>
          <p className="text-sm text-gray-500">Tier Upgrade Refund Receipt</p>
          <p className="text-sm text-gray-500">www.SevenGym.com</p>
        </div>

        {/* Refund info container */}
        <div className="p-4 bg-gray-50 border text-black">
          {/* Receipt basic details: ID, email, transaction ID, date */}
          <div className="text-center border-b pb-1">
            <p className="text-sm text-gray-500">
              Receipt #: SG-TURR-{refundInfo?.RefundID}
            </p>
            <p className="text-sm font-semibold text-gray-500">
              Customer: {refundInfo?.email}
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID: TX-{refundInfo?.RefundID?.slice(-6)}
            </p>
            <p className="text-sm text-gray-500">
              Date & Time:{" "}
              {refundInfo?.paymentTime
                ? new Date(refundInfo.paymentTime).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </p>
          </div>

          {/* Refunded Tier, Duration, Expiry Date */}
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
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between px-4">
                <p className="text-sm font-semibold">{item.label}:</p>
                <p className="text-black font-semibold">
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>

          {/* Refund Breakdown */}
          <div className="py-4 space-y-2 px-2">
            {/* Table headers */}
            <div className="flex justify-between font-bold">
              <p className="text-md">Product</p>
              <p className="text-md">Price</p>
            </div>

            {/* Product & total price row */}
            <div className="flex justify-between font-semibold border-b border-gray-400 pb-2">
              <p className="text-md">
                {TierUpgradePaymentData?.tier} Tier Upgrade
              </p>
              <p className="text-md">
                ${parseFloat(TierUpgradePaymentData?.totalPrice).toFixed(2)}
              </p>
            </div>

            {/* Total paid row */}
            <div className="flex justify-between font-semibold">
              <p className="text-md">Total Paid</p>
              <p className="text-md">
                ${parseFloat(TierUpgradePaymentData?.totalPrice).toFixed(2)}
              </p>
            </div>

            {/* Penalty details if applicable */}
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

            {/* Final computed refund value */}
            <div className="flex justify-between font-semibold text-green-500">
              <p className="text-md">Refund Amount</p>
              <p className="text-md font-bold">${computedRefundValue}</p>
            </div>
          </div>

          {/* Refund reason section */}
          <div className="px-4 py-4 border-t border-gray-300">
            <p className="text-sm font-semibold">Refund Reason:</p>
            <p className="text-sm text-gray-500">
              {refundInfo?.refundedReason}
            </p>
          </div>

          {/* Footer note */}
          <div className="text-center border-t pt-4">
            <p className="text-sm text-gray-500">
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>
        </div>
      </div>

      {/* Modal actions (Close & Download PDF) */}
      <div className="modal-action mt-6 flex justify-between">
        {/* Close button navigates user back */}
        <CommonButton
          text="Close"
          type="button"
          clickEvent={Close}
          bgColor="blue"
          textColor="text-white"
          width="[150px]"
          borderRadius="rounded-xl"
          px="px-5"
          py="py-3"
        />

        {/* Conditionally show PDF download if payment ID exists */}
        {TierUpgradePaymentData?.paymentID && (
          <CommonButton
            clickEvent={generatePDF}
            text="Download PDF"
            type="button"
            bgColor="green"
            textColor="text-white"
            width="[150px]"
            borderRadius="rounded-xl"
            px="px-5"
            py="py-3"
          />
        )}
      </div>
    </div>
  );
};

// Prop Validation
TierUpgradeRefundInvoiceModal.propTypes = {
  RefundID: PropTypes.string,
  Close: PropTypes.func,
};
export default TierUpgradeRefundInvoiceModal;
