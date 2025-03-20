/* eslint-disable react/prop-types */
import { useRef } from "react";
import { Link, useParams } from "react-router";

// Import Package
import { jsPDF } from "jspdf";
import domToImage from "dom-to-image";
import { useQuery } from "@tanstack/react-query";

// Import Utility
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

const TierUpgradePaymentModal = ({ PaymentID }) => {
  const axiosPublic = useAxiosPublic();
  const receiptRef = useRef();
  const { email } = useParams();

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
    enabled: !!PaymentID, // Only fetch if PaymentID is truthy
  });

  // Loading
  if (PaymentIDDataLoading) return <Loading />;

  // Error handling
  if (PaymentIDDataError) {
    return <FetchingError />;
  }

  const payment = PaymentIDData ? PaymentIDData[0] : null;

  // PDF generation function
  const generatePDF = async () => {
    if (!receiptRef.current) return;

    try {
      const blob = await domToImage.toBlob(receiptRef.current);
      const imgData = URL.createObjectURL(blob);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`PaymentReceipt_${payment.paymentID}.pdf`);
        URL.revokeObjectURL(imgData); // Cleanup
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="modal-box bg-[#ffffff] shadow-lg rounded-lg max-w-md mx-auto">
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
          <div className="pb-1 text-center border-b">
            <p className="text-sm text-[#6b7280]">
              Receipt #: SG-TUPR-<span>{payment?.paymentID}</span>
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

          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-[#6b7280]">
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>

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
        <form method="dialog">
          <Link to={`/User/UserProfile/${email}`}>
            <button className="bg-linear-to-bl hover:bg-linear-to-tr from-blue-400 to-blue-600 rounded-xl py-3 w-[150px] font-semibold cursor-pointer">
              Close
            </button>
          </Link>
        </form>

        {/* Conditional render: Only show "Download PDF" after data is loaded */}
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

export default TierUpgradePaymentModal;
