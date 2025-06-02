import { useRef, useState } from "react";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Basic Information
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Modal
import UserSessionRefundInvoiceModal from "../../../(UserPages)/UserTrainerManagement/UserSessionInvoice/UserSessionRefundInvoiceModal/UserSessionRefundInvoiceModal";

const TrainerSessionRefundInvoices = ({ TrainerSessionRefundData }) => {
  const modalRefundInvoiceRef = useRef(null);

  // State for selected invoice (for the modal)
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  // Close modal and reset selected invoice
  const closeRefundInvoiceModal = () => {
    modalRefundInvoiceRef.current?.close();
    setSelectedRefundInvoice(null);
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Trainer Sessions Refund&apos;s Invoices
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Data Table */}
        <table className="min-w-full table-auto border border-gray-300">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Booker Email</th>
              <th className="px-4 py-2 border">Trainer</th>
              <th className="px-4 py-2 border">Total Price</th>
              <th className="px-4 py-2 border">Refund Amount</th>
              <th className="px-4 py-2 border">Refunded At</th>
              <th className="px-4 py-2 border">Refund ID</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {TrainerSessionRefundData?.map((item, index) => {
              const info = item.bookingDataForHistory;

              return (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Serial Number */}
                  <td className="px-4 py-2 border">{index + 1}</td>

                  {/* Booker Email */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo
                      email={info?.bookerEmail}
                    />
                  </td>

                  {/* Trainer Info */}
                  <td className="border px-4 py-2">
                    <BookedTrainerBasicInfo
                      trainerID={info?.trainerId}
                      py={1}
                    />
                  </td>

                  {/* Total Price */}
                  <td className="px-4 py-2 border">
                    {info?.totalPrice === "free" ||
                    Number(info?.totalPrice) === 0
                      ? "Free"
                      : `$ ${info.totalPrice}`}
                  </td>

                  {/* Refund Amount */}
                  <td className="px-4 py-2 border">
                    {info?.totalPrice === "free" ||
                    isNaN(Number(item.PaymentRefund?.refundAmount)) ||
                    Number(item.PaymentRefund?.refundAmount) === 0
                      ? "Free"
                      : `$ ${item.PaymentRefund.refundAmount} (${info.RefundPercentage})`}
                  </td>

                  {/* Paid At */}
                  <td className="px-4 py-2 border">
                    {new Date(info?.paidAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>

                  {/* Refund ID */}
                  <td className="px-4 py-2 border">
                    {item.refundID &&
                    typeof item.refundID === "string" &&
                    item.refundID.trim() !== "" ? (
                      <span title={item.refundID}>
                        {item.refundID.length > 18
                          ? `${item.refundID.slice(
                              0,
                              10
                            )}...${item.refundID.slice(-4)}`
                          : item.refundID}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  {/* Refund Reason */}
                  <td className="px-4 py-2 border">{info?.reason || "N/A"}</td>

                  {/* Action */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedRefundInvoice(item);
                        modalRefundInvoiceRef.current?.showModal();
                      }}
                      className="border-2 border-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                      id={`view-details-btn-${item._id}`}
                    >
                      <FaFileInvoiceDollar className="text-gray-500" />
                    </button>

                    <Tooltip
                      anchorSelect={`#view-details-btn-${item._id}`}
                      content="View Session Refund Invoice"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Invoice */}
      <dialog ref={modalRefundInvoiceRef} className="modal">
        <UserSessionRefundInvoiceModal
          closeModal={closeRefundInvoiceModal}
          selectedRefundInvoice={selectedRefundInvoice}
        />
      </dialog>
    </>
  );
};

// Prop Validation
TrainerSessionRefundInvoices.propTypes = {
  TrainerSessionRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      refundID: PropTypes.string,
      refundTime: PropTypes.string,
      PaymentRefund: PropTypes.shape({
        stripePaymentID: PropTypes.string,
        refundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      bookingDataForHistory: PropTypes.shape({
        bookerEmail: PropTypes.string,
        trainerId: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        durationWeeks: PropTypes.number,
        status: PropTypes.string,
        reason: PropTypes.string,
        paidAt: PropTypes.string,
        RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        RefundPercentage: PropTypes.string,
      }).isRequired,
    })
  ).isRequired,
};

export default TrainerSessionRefundInvoices;
