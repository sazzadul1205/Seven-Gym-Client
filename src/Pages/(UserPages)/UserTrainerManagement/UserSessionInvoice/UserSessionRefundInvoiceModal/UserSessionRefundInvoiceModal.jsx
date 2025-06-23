import { useRef } from "react";

// Import Hooks
import Loading from "../../../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Utility
import { formatDate } from "../../../../../Utility/formatDate";
import { formatTimeTo12Hour } from "../../../../../Utility/formatTimeTo12Hour";

// Import Packages
import jsPDF from "jspdf";
import PropTypes from "prop-types";
import domToImage from "dom-to-image";
import { useQuery } from "@tanstack/react-query";

// import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const UserSessionRefundInvoiceModal = ({
  closeModal,
  selectedRefundInvoice,
}) => {
  const axiosPublic = useAxiosPublic();
  // Ref for Recept Ref
  const receiptRef = useRef();

  // Use selectedBooking.sessions directly
  const sessions = selectedRefundInvoice?.bookingDataForHistory?.sessions || [];
  const sessionQuery = sessions
    .map((id) => `ids=${encodeURIComponent(id)}`)
    .join("&");

  // Fetch session details by ID
  const {
    data: ScheduleByIDData,
    isLoading: ScheduleByIDDataIsLoading,
    error: ScheduleByIDDataError,
  } = useQuery({
    queryKey: ["ScheduleByIDData", sessions],
    enabled: sessions.length > 0,
    queryFn: () =>
      axiosPublic
        .get(`/Trainers_Schedule/ByID?${sessionQuery}`)
        .then((res) => res.data),
  });

  // Loading state
  if (ScheduleByIDDataIsLoading) return <Loading />;

  // Error handling
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
        pdf.save(`RefundReceipt_${selectedRefundInvoice?.refundID}.pdf`);

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
          <p className="text-sm text-[#6b7280]">Tier Upgrade Refund Receipt</p>
          {/* Change This */}
          <p className="text-sm text-[#6b7280]">www.SevenGym.com</p>
        </div>

        {/* Recept Details */}
        <div className="p-4 bg-[#f9fafb] border text-black">
          {/* -------- Header Part -------- */}
          <div className="pb-1 text-center border-b">
            {/* Header Part : Stripe Payment ID */}
            <p className="text-sm text-[#6b7280]">
              Receipt : <span>SG-SRR-{selectedRefundInvoice?.refundID}</span>
            </p>

            {/* Header Part : Booker Email */}
            <p className="text-sm text-[#6b7280]">
              Customer:{" "}
              <span>
                {selectedRefundInvoice?.bookingDataForHistory?.bookerEmail}
              </span>
            </p>

            {/* Header Part : Transaction ID */}
            <p className="text-sm text-[#6b7280]">
              Transaction ID: TX-{" "}
              <span>{selectedRefundInvoice?.refundID.slice(-6)}</span>
            </p>

            {/* Header Part : Paid At */}
            <p className="text-sm text-[#6b7280]">
              Date & Time :{" "}
              <span>{formatDate(selectedRefundInvoice?.refundedAt)}</span>
            </p>
          </div>

          {/* -------- Basic Info Part -------- */}
          <div className="space-y-2 mt-4">
            {/* Refund Status */}
            <div className="flex justify-between mt-4">
              <p className="text-sm font-semibold">Refund Status:</p>
              <p
                className={`${
                  selectedRefundInvoice?.bookingDataForHistory?.paid
                    ? "text-[#22c55e]"
                    : "text-[#ef4444]"
                } font-bold`}
              >
                {selectedRefundInvoice?.bookingDataForHistory?.paid
                  ? "Successful"
                  : "Failed"}
              </p>
            </div>

            {/* Duration */}
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Duration:</p>
              <p className="text-[#374151]">
                {selectedRefundInvoice?.bookingDataForHistory?.durationWeeks}{" "}
                {selectedRefundInvoice?.bookingDataForHistory?.durationWeeks ===
                1
                  ? "Week"
                  : "Weeks"}
              </p>
            </div>

            {/* Paid At */}
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Paid At :</p>
              <p className="text-[#374151]">
                {formatDate(
                  selectedRefundInvoice?.bookingDataForHistory?.paidAt
                )}
              </p>
            </div>

            {/* Refund At */}
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Refund At :</p>
              <p className="text-[#374151]">
                {formatDate(selectedRefundInvoice?.refundedAt)}
              </p>
            </div>

            {/* Refund Percentage */}
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Refund Percentage :</p>
              <p className="text-[#374151]">
                {selectedRefundInvoice?.bookingDataForHistory?.RefundPercentage}
              </p>
            </div>
          </div>

          {/* -------- Sessions Summary -------- */}
          <div className="space-y-2 mt-5">
            {/* Title */}
            <h3 className="text-center font-semibold text-gray-700 mb-2">
              Session Summary
            </h3>

            {/* Summary */}
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
                      {formatTimeTo12Hour(session?.time)} -{" "}
                      {addMinutesToTime(session?.time, 59)}
                    </span>
                  </div>

                  {/* Session ID and Price Row */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      <span className="text-gray-800">{session?.id}</span>
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {parseFloat(session?.classPrice) > 0
                        ? `${parseFloat(session?.classPrice).toFixed(2)} $`
                        : "Free"}{" "}
                      X{" "}
                      {
                        selectedRefundInvoice?.bookingDataForHistory
                          ?.durationWeeks
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* -------- Total Price -------- */}
          <div className="py-2 my-2 border-t border-gray-300">
            {/* Total Price */}
            <div className="flex justify-between font-semibold px-2">
              <p className="text-md">Total Price</p>
              <p className="text-md">
                {parseFloat(
                  selectedRefundInvoice?.bookingDataForHistory?.totalPrice
                ) > 0
                  ? `${parseFloat(
                      selectedRefundInvoice?.bookingDataForHistory?.totalPrice
                    ).toFixed(2)} $`
                  : "Free"}
              </p>
            </div>

            {/* Total Refund */}
            <div className="flex justify-between font-semibold px-2">
              <p className="text-md">
                Total Refund ({" "}
                {selectedRefundInvoice?.bookingDataForHistory?.RefundPercentage}{" "}
                )
              </p>
              <p className="text-md text-red-600">
                {selectedRefundInvoice?.bookingDataForHistory?.totalPrice &&
                selectedRefundInvoice?.bookingDataForHistory?.RefundPercentage
                  ? `-${(
                      parseFloat(
                        selectedRefundInvoice.bookingDataForHistory.totalPrice
                      ) *
                      (1 -
                        parseFloat(
                          selectedRefundInvoice.bookingDataForHistory
                            .RefundPercentage
                        ) /
                          100)
                    ).toFixed(2)} $`
                  : "-0.00 $"}
              </p>
            </div>

            {/* Refund Amount */}
            <div className="flex justify-between font-semibold px-2 border-t border-black pt-2 mt-2 ">
              <p className="text-md">Refund Amount</p>
              <p className="text-md">
                {parseFloat(
                  selectedRefundInvoice?.PaymentRefund?.refundAmount
                ) > 0
                  ? `${parseFloat(
                      selectedRefundInvoice?.PaymentRefund?.refundAmount
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
      <div className="modal-action mt-6 flex flex-col md:flex-row justify-between px-2">
        {/* Close Button */}

        <CommonButton
          text="Close"
          type="button"
          bgColor="blue"
          width="[150px]"
          clickEvent={() => closeModal()}
        />

        {/* Download PDF Button - Conditional render */}
        {selectedRefundInvoice && (
          <CommonButton
            clickEvent={generatePDF}
            text="Download"
            bgColor="green"
            width="[150px]"
            type="button"
          />
        )}
      </div>
    </div>
  );
};

// Prop Validation
UserSessionRefundInvoiceModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  selectedRefundInvoice: PropTypes.shape({
    refundID: PropTypes.string,
    refundedAt: PropTypes.string,
    bookingDataForHistory: PropTypes.shape({
      bookerEmail: PropTypes.string,
      paid: PropTypes.bool,
      durationWeeks: PropTypes.number,
      paidAt: PropTypes.string,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      RefundPercentage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      sessions: PropTypes.arrayOf(PropTypes.string),
    }),
    PaymentRefund: PropTypes.shape({
      refundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

export default UserSessionRefundInvoiceModal;

function addMinutesToTime(timeString, minutesToAdd) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);

  const hours12 = date.getHours() % 12 || 12;
  const minutesFormatted = String(date.getMinutes()).padStart(2, "0");
  const AMP = date.getHours() >= 12 ? "PM" : "AM";

  return `${hours12}:${minutesFormatted} ${AMP}`;
}
