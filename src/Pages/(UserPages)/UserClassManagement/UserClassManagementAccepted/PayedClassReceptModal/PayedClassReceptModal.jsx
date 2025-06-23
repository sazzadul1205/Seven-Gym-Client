import { useRef } from "react";

// import Packages
import jsPDF from "jspdf";
import PropTypes from "prop-types";
import domToImage from "dom-to-image";

// import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const PayedClassReceptModal = ({ paymentSuccessData }) => {
  const receiptRef = useRef();

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
          `PaymentClassBookingReceipt_${paymentSuccessData?.stripePaymentID}.pdf`
        );

        URL.revokeObjectURL(imgData); // Clean up
      };
    } catch (error) {
      console.error("Error generating POS PDF:", error);
    }
  };

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
      </div>

      {/* Details */}
      <div className="p-4 bg-[#f9fafb] border text-black rounded-md">
        <div className="pb-1 text-center border-b space-y-1">
          {/* Recept No */}
          <p className="text-sm text-[#6b7280]">
            Receipt:&nbsp;
            <span
              className="max-w-[200px] sm:max-w-[300px] inline-block truncate align-middle"
              title={`SG-TUPR-${paymentSuccessData?.stripePaymentID}`}
            >
              SG-TUPR-{paymentSuccessData?.stripePaymentID}
            </span>
          </p>

          {/* Customer */}
          <p className="text-sm font-semibold text-[#6b7280]">
            Customer:{" "}
            <span>{paymentSuccessData?.applicant?.applicantData?.email}</span>
          </p>

          {/* Transaction ID */}
          <p className="text-sm flex text-[#6b7280]">
            Transaction ID:&nbsp;
            <span
              className="max-w-[150px] sm:max-w-[300px] inline-block truncate align-middle"
              title={`TX-${paymentSuccessData?.stripePaymentID}`}
            >
              TX-{paymentSuccessData?.stripePaymentID}
            </span>
          </p>

          {/* Sate and Time */}
          <p className="text-sm text-[#6b7280]">
            Date & Time:{" "}
            <span>
              {new Date(paymentSuccessData?.paidAt)
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

        {/* Status, Duration, Method */}
        <div className="space-y-2 mt-4 text-sm">
          <div className="flex justify-between">
            <p className="font-semibold">Payment Status:</p>
            <p
              className={`${
                paymentSuccessData?.paid ? "text-[#22c55e]" : "text-[#ef4444]"
              } font-bold`}
            >
              {paymentSuccessData?.paid ? "Successful" : "Failed"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Duration:</p>
            <p className="text-[#374151]">
              {paymentSuccessData?.applicant?.duration}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Payment Method:</p>
            <p className="text-[#374151]">
              {paymentSuccessData?.paymentMethod}
            </p>
          </div>
        </div>

        {/* Price list */}
        <div className="space-y-2 mt-8">
          <div className="flex justify-between font-bold px-2">
            <p>Product</p>
            <p>Price</p>
          </div>

          <div className="flex justify-between font-semibold border-b border-[#9ca3af] pb-2 px-2">
            <p>{paymentSuccessData?.applicant?.classesName}</p>
            <p> $ {paymentSuccessData?.applicant?.totalPrice}</p>
          </div>
          <div className="flex justify-between font-semibold px-2">
            <p>Total :</p>
            <p> $ {paymentSuccessData?.applicant?.totalPrice}</p>
          </div>
        </div>

        {/* Footer Messages */}
        <div className="mt-6 text-center border-t pt-4 text-sm text-[#6b7280]">
          <p>Thank you for choosing Seven Gym. We appreciate your business!</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="modal-action mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="w-full sm:w-auto">
          <CommonButton
            clickEvent={() =>
              document.getElementById("Payed_Class_Recept_Modal").close()
            }
            text="Close"
            bgColor="blue"
            width="full"
            type="button"
            px="px-5"
          />
        </div>

        {paymentSuccessData?.paid && (
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
PayedClassReceptModal.propTypes = {
  paymentSuccessData: PropTypes.oneOfType([
    PropTypes.shape({
      stripePaymentID: PropTypes.string.isRequired,
      paidAt: PropTypes.string.isRequired,
      paid: PropTypes.bool.isRequired,
      paymentMethod: PropTypes.string,
      applicant: PropTypes.shape({
        duration: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        classesName: PropTypes.string,
        applicantData: PropTypes.shape({
          email: PropTypes.string,
        }),
      }),
    }),
    PropTypes.string,
  ]).isRequired,
};

export default PayedClassReceptModal;
