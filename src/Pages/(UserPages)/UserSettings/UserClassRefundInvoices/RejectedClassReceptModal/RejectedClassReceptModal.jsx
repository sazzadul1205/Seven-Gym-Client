import { useRef } from "react";

// import Packages
import jsPDF from "jspdf";
import PropTypes from "prop-types";
import domToImage from "dom-to-image";

// import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const getDaysLeft = (endDateStr, droppedAtStr) => {
  if (!endDateStr || !droppedAtStr) return 0;

  const [endDay, endMonth, endYear] = endDateStr.split("-").map(Number);
  const endDate = new Date(endYear, endMonth - 1, endDay);
  const droppedAt = new Date(droppedAtStr);

  const timeDiff = endDate.getTime() - droppedAt.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysLeft > 0 ? daysLeft : 0;
};

const RejectedClassReceptModal = ({ SelectRefundInvoice }) => {
  const receiptRef = useRef();

  const daysLeft = getDaysLeft(
    SelectRefundInvoice?.endDate,
    SelectRefundInvoice?.droppedAt
  );

  const NonRefundedAmount =
    SelectRefundInvoice?.applicant?.totalPrice -
    SelectRefundInvoice?.refundAmount;

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
          `SelectRefundInvoice_${SelectRefundInvoice?.stripePaymentID}.pdf`
        );

        URL.revokeObjectURL(imgData); // Clean up
      };
    } catch (error) {
      console.error("Error generating POS PDF:", error);
    }
  };

  return (
    <div className="modal-box bg-[#ffffff] shadow-lg rounded-lg w-full max-w-md mx-auto p-4 sm:p-6 overflow-y-auto text-black">
      {/* Receipt Section */}
      <div ref={receiptRef} id="receipt">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-1">
          <h4 className="text-2xl font-bold text-[#1f2937]">Seven Gym</h4>
          <p className="text-sm text-[#6b7280]">Class Booking Refund Receipt</p>
          <p className="text-sm text-[#6b7280]">www.SevenGym.com</p>
        </div>

        {/* Details */}
        <div className="p-4 bg-[#f9fafb] border text-black rounded-md">
          <div className="pb-1 text-center border-b space-y-1">
            {/* Recept No */}
            <p className="text-sm text-[#6b7280]">
              Receipt:&nbsp;
              <span
                className="max-w-[200px] sm:max-w-[300px] inline-block truncate align-middle"
                title={`SG-CBPR-${SelectRefundInvoice?.stripePaymentID}`}
              >
                SG-CBPR-{SelectRefundInvoice?.stripePaymentID}
              </span>
            </p>

            {/* Customer */}
            <p className="text-sm font-semibold text-[#6b7280]">
              Customer:{" "}
              <span>
                {SelectRefundInvoice?.applicant?.applicantData?.email}
              </span>
            </p>

            {/* Transaction ID */}
            <p className="text-sm text-center text-[#6b7280]">
              Transaction ID:&nbsp;
              <span
                className="mx-auto max-w-[180px] sm:max-w-[300px] inline-block truncate align-middle"
                title={`TX-${SelectRefundInvoice?.stripePaymentID}`}
              >
                TX-{SelectRefundInvoice?.stripePaymentID}
              </span>
            </p>

            {/* Sate and Time */}
            <p className="text-sm text-[#6b7280]">
              Date & Time:{" "}
              <span>
                {new Date(SelectRefundInvoice?.droppedAt)
                  .toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace(",", "")}
              </span>
            </p>
          </div>

          {/* Price list */}
          <div className="space-y-2 mt-8">
            <div className="flex justify-between font-bold px-2">
              <p>Product</p>
              <p>Price</p>
            </div>

            <div className="flex justify-between font-semibold px-2">
              <p>{SelectRefundInvoice?.applicant?.classesName}</p>
              <p> $ {SelectRefundInvoice?.applicant?.totalPrice}</p>
            </div>

            <div className="p-[1px] bg-black" />

            <div className="flex justify-between font-semibold px-2">
              <p>Total :</p>
              <p> $ {SelectRefundInvoice?.applicant?.totalPrice}</p>
            </div>

            <div className="flex justify-between font-semibold px-2">
              <p>Deducted ( {daysLeft} Days ) </p>
              <p> $ {NonRefundedAmount.toFixed(2)}</p>
            </div>

            <div className="p-[1px] bg-black" />

            <div className="flex justify-between font-semibold px-2">
              <p>Refunded : </p>
              <p> $ {SelectRefundInvoice?.refundAmount}</p>
            </div>
          </div>

          {/* Footer Messages */}
          <div className="mt-6 text-center border-t pt-4 text-sm text-[#6b7280]">
            <p>
              Thank you for choosing Seven Gym. We appreciate your business!
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="modal-action mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="w-full sm:w-auto">
          <CommonButton
            clickEvent={() =>
              document.getElementById("Rejected_Class_Recept_Modal").close()
            }
            text="Close"
            bgColor="blue"
            width="full"
            type="button"
            px="px-5"
          />
        </div>

        {SelectRefundInvoice?.paid && (
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
RejectedClassReceptModal.propTypes = {
  SelectRefundInvoice: PropTypes.shape({
    stripePaymentID: PropTypes.string,
    paid: PropTypes.bool,
    paidAt: PropTypes.string,
    droppedAt: PropTypes.string,
    endDate: PropTypes.string,
    refundAmount: PropTypes.number,
    applicant: PropTypes.shape({
      classesName: PropTypes.string,
      totalPrice: PropTypes.number,
      applicantData: PropTypes.shape({
        email: PropTypes.string,
        name: PropTypes.string,
        phone: PropTypes.string,
        Userid: PropTypes.string,
      }),
    }),
  }),
};

export default RejectedClassReceptModal;
