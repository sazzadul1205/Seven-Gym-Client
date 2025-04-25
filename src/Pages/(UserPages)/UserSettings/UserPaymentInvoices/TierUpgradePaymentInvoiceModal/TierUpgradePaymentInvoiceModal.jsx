import { useRef } from "react";

// Import Package
import { jsPDF } from "jspdf";
import PropTypes from "prop-types";
import domToImage from "dom-to-image";
import { useQuery } from "@tanstack/react-query";

import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TierUpgradePaymentInvoiceModal = ({ PaymentID, Close }) => {
  const axiosPublic = useAxiosPublic();
  const receiptRef = useRef();

  console.log(PaymentID);

  // Fetch tier data only when PaymentID is provided
  const {
    data: PaymentIDData,
    isLoading: PaymentIDDataLoading,
    error: PaymentIDDataError,
  } = useQuery({
    queryKey: ["PaymentIDData", PaymentID],
    queryFn: () =>
      axiosPublic
        .get(`/Tier_Upgrade_Payment/search?paymentID=${PaymentID}`)
        .then((res) => res.data),
    enabled: !!PaymentID, // Only fetch if PaymentID is defined
  });

  // Show loading screen while fetching
  if (PaymentIDDataLoading) return <Loading />;

  // Show error if fetching fails
  if (PaymentIDDataError) return <FetchingError />;

  // Return nothing if data exists but empty or malformed
  if (!PaymentIDData || PaymentIDData.length === 0) return null;

  const payment = PaymentIDData[0]; // Extract first record

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

  return (
    <div className="modal-box p-0 md:p-4 bg-[#ffffff] shadow-lg rounded-lg max-w-md mx-auto">
      {/* Receipt Section */}
      <div ref={receiptRef} id="receipt">
        {/* Receipt Header */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-[#1f2937]">Seven Gym</h4>
          <p className="text-sm text-[#6b7280]">Tier Upgrade Payment Receipt</p>
          {/* Change This */}
          <p className="text-sm text-[#6b7280]">www.SevenGym.com</p>
        </div>

        {/* Receipt Details */}
        <div className="p-4 bg-[#f9fafb] border text-black">
          {/* Top Part */}
          <div className="pb-1 text-center border-b">
            <p className="text-sm text-[#6b7280]">
              Receipt : SG-TUPR-<span>{payment?.paymentID}</span>
            </p>
            <p className="text-sm font-semibold text-[#6b7280]">
              Customer: <span>{payment?.email}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Transaction ID: TX- <span>{payment?.paymentID.slice(-6)}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Date & Time : <span>{payment?.dateTime}</span>
            </p>
          </div>

          {/* Status and Duration */}
          <div className="space-y-2 mt-4">
            <div className="flex justify-between mt-4">
              <p className="text-sm font-semibold">Payment Status:</p>
              <p
                className={`${
                  payment?.Payed ? "text-[#22c55e]" : "text-[#ef4444]"
                } font-bold`}
              >
                {payment?.Payed ? "Successful" : "Failed"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Duration:</p>
              <p className="text-[#374151]">{payment?.duration}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Payment Method:</p>
              <p className="text-[#374151]">{payment?.paymentMethod}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Exp Date:</p>
              <p className="text-[#374151]">{payment?.endDate}</p>
            </div>
          </div>

          {/* Product and Price */}
          <div className="space-y-2 mt-10">
            <div className="flex justify-between font-bold px-2">
              <p className="text-md">Product</p>
              <p className="text-md">Price</p>
            </div>
            <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
              <p className="text-md">{payment?.tier} Tier Upgrade</p>
              <p className="text-md">${payment?.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-semibold px-2">
              <p className="text-md">Total</p>
              <p className="text-md">${payment?.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Thank you Message */}
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-[#6b7280]">
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>

          {/* Conditions */}
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-xs text-[#6b7280]">
              {" "}
              You are eligible for a full refund within the first 3 days. After
              that, refunds will be prorated based on the days used, along with
              a 10% processing fee. Changing tiers will also incur the same
              conditions.{" "}
            </p>
          </div>
        </div>
      </div>

      {/* Close Button and PDF Generation Button */}
      <div className="modal-action mt-6 flex justify-between">
        {/* Close Button */}
        <CommonButton
          text="Close"
          clickEvent={Close}
          bgColor="blue"
          width="[150px]"
          type="button"
        />

        {/* Download PDF Button - Conditional render */}
        {payment && (
          <CommonButton
            clickEvent={generatePDF}
            text="Download PDF"
            bgColor="green"
            width="[150px]"
            type="button"
          />
        )}
      </div>
    </div>
  );
};

export default TierUpgradePaymentInvoiceModal;
