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

// import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const TierUpgradePaymentModal = ({ PaymentID }) => {
  const axiosPublic = useAxiosPublic();
  const receiptRef = useRef();
  const { email } = useParams();

  // Fetch tier data only when PaymentID is provided
  const {
    data: PaymentData,
    isLoading: PaymentDataLoading,
    error: PaymentDataError,
  } = useQuery({
    queryKey: ["PaymentData", PaymentID],
    queryFn: () =>
      axiosPublic
        .get(`/Tier_Upgrade_Payment/search?paymentID=${PaymentID}`)
        .then((res) => res.data),
    enabled: !!PaymentID, // Only fetch if PaymentID is defined
  });

  // Show loading screen while fetching
  if (PaymentDataLoading) return <Loading />;

  // Show error if fetching fails
  if (PaymentDataError) return <FetchingError />;

  // Return nothing if data exists but empty or malformed
  if (!PaymentData || PaymentData.length === 0) return null;

  const payment = PaymentData[0]; // Extract first record

  // PDF generation function
  const generatePDF = async () => {
    if (!receiptRef.current) return;

    try {
      const blob = await domToImage.toBlob(receiptRef.current);
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
        pdf.save(`PaymentSessionReceipt_${payment?.paymentID}.pdf`);

        URL.revokeObjectURL(imgData); // Clean up
      };
    } catch (error) {
      console.error("Error generating POS PDF:", error);
    }
  };

  console.log(PaymentData);

  return (
    <div className="modal-box bg-[#ffffff] shadow-lg rounded-lg w-full max-w-md mx-auto p-4 sm:p-6 overflow-y-auto">
      {/* Receipt Section */}
      <div ref={receiptRef} id="receipt">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-[#1f2937]">Seven Gym</h4>
          <p className="text-sm text-[#6b7280]">Tier Upgrade Payment Receipt</p>
          <p className="text-sm text-[#6b7280]">www.SevenGym.com</p>
        </div>

        {/* Details */}
        <div className="p-4 bg-[#f9fafb] border text-black rounded-md">
          <div className="pb-1 text-center border-b space-y-1">
            <p className="text-sm text-[#6b7280]">
              Receipt : SG-TUPR-<span>{payment?.paymentID}</span>
            </p>
            <p className="text-sm font-semibold text-[#6b7280]">
              Customer: <span>{payment?.email}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Transaction ID: TX-<span>{payment?.paymentID.slice(-6)}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Date & Time: <span>{payment?.dateTime}</span>
            </p>
          </div>

          {/* Status, Duration, Method */}
          <div className="space-y-2 mt-4 text-sm">
            <div className="flex justify-between">
              <p className="font-semibold">Payment Status:</p>
              <p
                className={`${
                  payment?.Payed ? "text-[#22c55e]" : "text-[#ef4444]"
                } font-bold`}
              >
                {payment?.Payed ? "Successful" : "Failed"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Duration:</p>
              <p className="text-[#374151]">{payment?.duration}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Payment Method:</p>
              <p className="text-[#374151]">{payment?.paymentMethod}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Exp Date:</p>
              <p className="text-[#374151]">{payment?.endDate}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2 mt-8">
            <div className="flex justify-between font-bold px-2">
              <p>Product</p>
              <p>Price</p>
            </div>
            <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
              <p>{payment?.tier} Tier Upgrade</p>
              <p>${payment?.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-semibold px-2">
              <p>Total</p>
              <p>${payment?.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Footer Messages */}
          <div className="mt-6 text-center border-t pt-4 text-sm text-[#6b7280]">
            <p>
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>
          <div className="mt-4 text-center border-t pt-4 text-xs text-[#6b7280]">
            <p>
              You are eligible for a full refund within the first 3 days. After
              that, refunds will be prorated based on the days used, with a 10%
              processing fee. Changing tiers will also incur the same
              conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="modal-action mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
        <Link to={`/User/UserProfile/${email}`} className="w-full sm:w-auto">
          <CommonButton
            text="Close"
            bgColor="blue"
            width="full"
            type="button"
          />
        </Link>

        {payment && (
          <div className="w-full sm:w-auto">
            <CommonButton
              clickEvent={generatePDF}
              text="Download PDF"
              bgColor="green"
              width="full"
              type="button"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Prop Validation
TierUpgradePaymentModal.propTypes = {
  PaymentID: PropTypes.string,
};

export default TierUpgradePaymentModal;
