/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import Loading from "../../../../../Shared/Loading/Loading";
import domToImage from "dom-to-image"; // Import dom-to-image
import { jsPDF } from "jspdf"; // Import jsPDF library
import { Link, useParams } from "react-router";

const TUPaymentModal = ({ PaymentID }) => {
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
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-[#ffffff]">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load payment data.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-[#ffffff] font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
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
          <p className="text-sm text-[#6b7280]">www.sevengym.com</p>
        </div>

        {/* Receipt Details */}
        <div className="p-4 bg-[#f9fafb] border">
          <div className="pb-1 text-center border-b">
            <p className="text-sm text-[#6b7280]">
              Receipt #: 001- <span>{payment?.paymentID}</span>
            </p>
            <p className="text-sm font-semibold text-[#6b7280]">
              Customer: <span>{payment?.email}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Transaction ID: TX- <span>{payment?.paymentID.slice(-6)}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Date:{" "}
              <span>{new Date(payment?.dateTime).toLocaleDateString()}</span>
            </p>
          </div>

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
          </div>

          <div className="space-y-2 mt-10">
            <div className="flex justify-between font-bold px-2">
              <p className="text-md">Product</p>
              <p className="text-md">Price</p>
            </div>
            <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
              <p className="text-md">{payment?.tier}</p>
              <p className="text-md">${payment?.totalPrice}</p>
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
        </div>
      </div>

      {/* Close Button and PDF Generation Button */}
      <div className="modal-action mt-6 flex justify-between">
        <form method="dialog">
          <Link to={`/User/${email}/UserProfile`}>
            <button className="rounded-xl py-3 bg-[#3b82f6] text-[#ffffff] hover:bg-[#60a5fa] w-[150px]">
              Close
            </button>
          </Link>
        </form>

        {/* Conditional render: Only show "Download PDF" after data is loaded */}
        {payment && (
          <button
            onClick={generatePDF}
            className="rounded-xl py-3 bg-[#22c55e] text-[#ffffff] hover:bg-[#4ade80] w-[150px]"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default TUPaymentModal;
