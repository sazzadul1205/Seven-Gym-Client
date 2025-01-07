/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import Loading from "../../../../../Shared/Loading/Loading";

const TUPaymentModal = ({ PaymentID }) => {
  const axiosPublic = useAxiosPublic();
  const receiptRef = useRef();

  // Fetch tier data
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
  });

  // Print or Save PDF
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `PaymentReceipt_${PaymentIDData?.paymentID}`,
  });

  // Loading
  if (PaymentIDDataLoading) return <Loading />;

  // Error handling
  if (PaymentIDDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-3xl text-red-500 font-bold mb-8">
          Failed to load payment data.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  const payment = PaymentIDData[0] || null; // Access the first (and only) payment object

  return (
    <div className="modal-box bg-white shadow-lg rounded-lg max-w-md mx-auto">
      {/* Receipt Section */}
      <div ref={receiptRef} id="receipt">
        {/* Receipt Header */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-gray-800">Seven Gym</h4>
          <p className="text-sm text-gray-500">Tier Upgrade Payment Receipt</p>
          <p className="text-sm text-gray-500">www.sevengym.com</p>
        </div>

        {/* Receipt Details */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="pb-1 text-center border-b">
            <p className="text-sm text-gray-500">
              Receipt #: 001- <span>{payment.paymentID}</span>
            </p>
            <p className="text-sm font-semibold text-gray-500">
              Customer: <span>{payment.email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID: TX- <span>{payment.paymentID.slice(-6)}</span>
            </p>
            <p className="text-sm text-gray-500">
              Date:{" "}
              <span>{new Date(payment.dateTime).toLocaleDateString()}</span>
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between mt-4">
              <p className="text-sm font-semibold">Payment Status:</p>
              <p
                className={`${
                  payment.Payed ? "text-green-500" : "text-red-500"
                } font-bold`}
              >
                {payment.Payed ? "Successful" : "Failed"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Duration:</p>
              <p className="text-gray-700">{payment.duration}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Payment Method:</p>
              <p className="text-gray-700">{payment.paymentMethod}</p>
            </div>
          </div>

          <div className="space-y-2 mt-10">
            <div className="flex justify-between font-bold px-2">
              <p className="text-md">Product</p>
              <p className="text-md">Price</p>
            </div>
            <div className="flex justify-between font-semibold border-b border-gray-400 pb-2 px-2">
              <p className="text-md">{payment.tier}</p>
              <p className="text-md">${payment.totalPrice}</p>
            </div>
            <div className="flex justify-between font-semibold px-2">
              <p className="text-md">Total</p>
              <p className="text-md">${payment.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-gray-500">
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>
        </div>
      </div>

      {/* Close Button and Print Button */}
      <div className="modal-action mt-6 flex justify-between">
        <form method="dialog">
          <button className="btn bg-blue-500 text-white hover:bg-blue-400">
            Close
          </button>
        </form>

        {/* Conditional render: Only show "Download PDF" after data is loaded */}
        {payment && (
          <button
            onClick={handlePrint}
            className="btn bg-green-500 text-white hover:bg-green-400"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default TUPaymentModal;
