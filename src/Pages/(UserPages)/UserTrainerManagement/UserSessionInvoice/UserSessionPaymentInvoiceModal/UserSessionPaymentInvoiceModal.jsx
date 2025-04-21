/* eslint-disable react/prop-types */
import { useRef } from "react";

// import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Utility
import { formatDate } from "../../../../../Utility/formatDate";
import { formatTimeTo12Hour } from "../../../../../Utility/formatTimeTo12Hour";

// Import Packages
import jsPDF from "jspdf";
import domToImage from "dom-to-image";
import { useQuery } from "@tanstack/react-query";

// import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const UserSessionPaymentInvoiceModal = ({
  closeModal,
  selectedPaymentInvoice,
}) => {
  const axiosPublic = useAxiosPublic();

  // Ref for Recept Ref
  const receiptRef = useRef();

  // Use selectedBooking.sessions directly
  const sessionQuery =
    selectedPaymentInvoice?.sessionInfo?.sessions
      ?.map((id) => `ids=${encodeURIComponent(id)}`)
      .join("&") || "";

  // Fetch session details by ID
  const {
    data: ScheduleByIDData,
    isLoading: ScheduleByIDDataIsLoading,
    error: ScheduleByIDDataError,
  } = useQuery({
    queryKey: [
      "ScheduleByIDData",
      selectedPaymentInvoice?.sessionInfo?.sessions,
    ],
    enabled: !!selectedPaymentInvoice?.sessionInfo?.sessions?.length,
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByID?${sessionQuery}`)
        .then((res) => res.data),
  });

  // Load management
  if (ScheduleByIDDataIsLoading) return <Loading />;

  // Error Management
  if (ScheduleByIDDataError) return <FetchingError />;

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
        pdf.save(
          `PaymentReceipt_${selectedPaymentInvoice?.stripePaymentID}.pdf`
        );

        URL.revokeObjectURL(imgData); // Clean up
      };
    } catch (error) {
      console.error("Error generating POS PDF:", error);
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

        {/* Recept Details */}
        <div className="p-4 bg-[#f9fafb] border text-black">
          {/* -------- Header Part -------- */}
          <div className="pb-1 text-center border-b">
            <p className="text-sm text-[#6b7280]">
              Receipt :{" "}
              <span>SG-SPR-{selectedPaymentInvoice?.stripePaymentID}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Customer:{" "}
              <span>{selectedPaymentInvoice?.sessionInfo?.bookerEmail}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Transaction ID: TX-{" "}
              <span>{selectedPaymentInvoice?.stripePaymentID.slice(-6)}</span>
            </p>
            <p className="text-sm text-[#6b7280]">
              Date & Time :{" "}
              <span>
                {formatDate(selectedPaymentInvoice?.sessionInfo?.paidAt)}
              </span>
            </p>
          </div>

          {/* -------- Basic Info Part -------- */}
          <div className="space-y-2 mt-4">
            <div className="flex justify-between mt-4">
              <p className="text-sm font-semibold">Payment Status:</p>
              <p
                className={`${
                  selectedPaymentInvoice?.sessionInfo?.paid
                    ? "text-[#22c55e]"
                    : "text-[#ef4444]"
                } font-bold`}
              >
                {selectedPaymentInvoice?.sessionInfo?.paid
                  ? "Successful"
                  : "Failed"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Duration:</p>
              <p className="text-[#374151]">
                {selectedPaymentInvoice?.sessionInfo?.durationWeeks}{" "}
                {selectedPaymentInvoice?.sessionInfo?.durationWeeks === 1
                  ? "Week"
                  : "Weeks"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Payment Method:</p>
              <p className="text-[#374151]">
                {selectedPaymentInvoice?.paymentMethod}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Paid At :</p>
              <p className="text-[#374151]">
                {formatDate(selectedPaymentInvoice?.sessionInfo?.paidAt)}
              </p>
            </div>
          </div>

          {/* -------- Sessions Summary -------- */}
          <div className="space-y-2 mt-5">
            <h3 className="text-center font-semibold text-gray-700 mb-2">
              Session Summary
            </h3>
            <div className="space-y-4">
              {ScheduleByIDData?.map((session, index) => (
                <div
                  key={session._id || index}
                  className="p-3 rounded-md border border-gray-200 bg-white"
                >
                  {/* Day and Time Row */}
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    <span className="font-medium">{session?.day}</span>
                    <span>
                      {formatTimeTo12Hour(session?.start)} -{" "}
                      {formatTimeTo12Hour(session?.end)}
                    </span>
                  </div>

                  {/* Session ID and Price Row */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      Session ID:{" "}
                      <span className="text-gray-800">{session?.id}</span>
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {parseFloat(session?.classPrice) > 0
                        ? `${parseFloat(session?.classPrice).toFixed(2)} $`
                        : "Free"}{" "}
                      X {selectedPaymentInvoice?.sessionInfo?.durationWeeks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* -------- Total Price -------- */}
          <div className="py-2 my-2 border-t border-gray-300">
            <div className="flex justify-between font-semibold px-2">
              <p className="text-md">Total Price</p>
              <p className="text-md">
                {parseFloat(selectedPaymentInvoice?.sessionInfo?.totalPrice) > 0
                  ? `${parseFloat(
                      selectedPaymentInvoice?.sessionInfo?.totalPrice
                    ).toFixed(2)} $`
                  : "Free"}
              </p>
            </div>
          </div>

          {/* -------- Thank you Message -------- */}
          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-[#6b7280]">
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>
        </div>
      </div>

      {/* Close Button and PDF Generation Button */}
      <div className="modal-action mt-6 flex justify-between">
        {/* Close Button */}

        <CommonButton
          text="Close"
          type="button"
          bgColor="blue"
          width="[150px]"
          clickEvent={() => closeModal()}
        />

        {/* Download PDF Button - Conditional render */}
        {selectedPaymentInvoice && (
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

export default UserSessionPaymentInvoiceModal;
