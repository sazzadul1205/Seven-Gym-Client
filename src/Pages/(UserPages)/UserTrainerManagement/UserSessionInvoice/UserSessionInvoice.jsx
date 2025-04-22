import { useRef, useState } from "react";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";

// Import Utility
import { formatDate } from "../../../../Utility/formatDate";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Modal
import UserSessionPaymentInvoiceModal from "./UserSessionPaymentInvoiceModal/UserSessionPaymentInvoiceModal";
import { FaTriangleExclamation } from "react-icons/fa6";
import UserSessionRefundInvoiceModal from "./UserSessionRefundInvoiceModal/UserSessionRefundInvoiceModal";

const UserSessionInvoice = ({
  SessionRefundInvoicesData,
  SessionPaymentInvoicesData,
}) => {
  // Initializes a state variable for the selected booking.
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  // Create a ref for the modal
  const modalPaymentRef = useRef(null);
  const modalRefundRef = useRef(null);

  // Close Modal Handler
  const closePaymentInvoiceModal = () => {
    modalPaymentRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedPaymentInvoice(null);
  };

  // Close Modal Handler
  const closeRefundInvoiceModal = () => {
    modalRefundRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedRefundInvoice(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center py-2">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold">
          Session Payment and Refund Invoice
        </h3>
      </div>

      {/* Session Payment Invoices List */}
      <div className="py-1">
        {/* Title */}
        <div className="flex gap-3 justify-center items-center text-2xl bg-[#A1662F] font-bold text-center border border-white text-white py-1">
          Session Payment Invoices
        </div>

        {/* Content */}
        {SessionPaymentInvoicesData.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full table-auto bg-white border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#A1662F] text-white">
                    {[
                      "No",
                      "Payment ID",
                      "Trainer",
                      "Paid At",
                      "Total Price",
                      "Sessions",
                      "Durations",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-4 py-2 border border-gray-200`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {SessionPaymentInvoicesData?.map((item, index) => (
                    <tr
                      key={`List_No_${item?._id}_${index}`}
                      className={`border-b bg-white hover:bg-gray-200 cursor-default`}
                    >
                      {/* Number */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {index + 1} .
                      </td>

                      {/* Session Payment Id */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {item?.stripePaymentID}
                      </td>

                      {/* Session Trainer Name */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {item?.BookingInfo?.trainer}
                      </td>

                      {/* Session Paid At */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {formatDate(item?.BookingInfo?.paidAt)}
                      </td>

                      {/* Session Price */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {item?.BookingInfo?.totalPrice === "0.00" ||
                        item?.BookingInfo?.totalPrice === 0.0
                          ? "Free"
                          : `$ ${item?.BookingInfo?.totalPrice}`}
                      </td>

                      {/* Session Length */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {item?.BookingInfo?.sessions?.length}
                      </td>

                      {/* Session Length */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {item?.BookingInfo?.durationWeeks}{" "}
                        {item?.BookingInfo?.durationWeeks > 1
                          ? "Weeks"
                          : "Week"}
                      </td>

                      {/* Invoice Button */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            id={`view-details-btn-${item._id}`} // Unique ID for each button
                            className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setSelectedPaymentInvoice(item);
                              modalPaymentRef.current?.showModal();
                            }}
                          >
                            <FaFileInvoiceDollar className="text-green-500" />
                          </button>
                          <Tooltip
                            anchorSelect={`#view-details-btn-${item._id}`}
                            content="View Detailed Booking Data"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // If No Payment are fetched then show this
          <div className="flex items-center bg-gray-100 py-5 text-black italic">
            <div className="flex gap-4 mx-auto items-center">
              <FaTriangleExclamation className="text-xl text-red-500" />
              No Payment Made This Far.
            </div>
          </div>
        )}
      </div>

      {/* Session Refund Invoice List */}
      <div className="py-4">
        {/* Title */}
        <div className="flex gap-3 justify-center items-center text-2xl bg-[#A1662F] font-bold text-center border border-white text-white py-1">
          Session Refund Invoices
        </div>

        {/* Content */}
        {SessionRefundInvoicesData.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full table-auto bg-white border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#A1662F] text-white">
                    {[
                      "No",
                      "Refund ID",
                      "Trainer",
                      "Refund Amount",
                      "Refund At",
                      "Sessions",
                      "Duration",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-4 py-2 border border-gray-200`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {SessionRefundInvoicesData?.map((item, index) => (
                    <tr
                      key={`List_No_${item?._id}_${index}`}
                      className={`border-b bg-white hover:bg-gray-200 cursor-default`}
                    >
                      {/* Number */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {index + 1} .
                      </td>

                      {/* Session Payment Id */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {item?.refundID}
                      </td>

                      {/* Session Trainer Name */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {item?.bookingDataForHistory?.trainer}
                      </td>

                      {/* Session Refund Amount */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {item?.bookingDataForHistory?.RefundPercentage} (
                        {item?.bookingDataForHistory?.RefundAmount !==
                          undefined && (
                          <span>
                            {Number(
                              item.bookingDataForHistory.RefundAmount
                            ).toFixed(2)}{" "}
                            $
                          </span>
                        )}
                        )
                      </td>

                      {/* Session Price */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {formatDate(item?.refundedAt)}
                      </td>

                      {/* Session Length */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {item?.bookingDataForHistory?.sessions?.length}
                      </td>

                      {/* Session Duration */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {item?.bookingDataForHistory?.durationWeeks}{" "}
                        {item?.bookingDataForHistory?.durationWeeks === 1
                          ? "Week"
                          : "Weeks"}
                      </td>

                      {/* Invoice Button */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            id={`view-details-btn-${item._id}`} // Unique ID for each button
                            className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setSelectedRefundInvoice(item);
                              modalRefundRef.current?.showModal();
                            }}
                          >
                            <FaFileInvoiceDollar className="text-green-500" />
                          </button>
                          <Tooltip
                            anchorSelect={`#view-details-btn-${item._id}`}
                            content="View Detailed Booking Data"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // If No Refund are fetched then show this
          <div className="flex items-center bg-gray-100 py-5 text-black italic">
            <div className="flex gap-4 mx-auto items-center">
              <FaTriangleExclamation className="text-xl text-red-500" />
              No Refund Made This Far.
            </div>
          </div>
        )}
      </div>

      {/* User Trainer Booking Info Modal */}
      <dialog ref={modalPaymentRef} className="modal">
        <UserSessionPaymentInvoiceModal
          closeModal={closePaymentInvoiceModal}
          selectedPaymentInvoice={selectedPaymentInvoice}
        />
      </dialog>

      {/* User Trainer Booking Info Modal */}
      <dialog ref={modalRefundRef} className="modal">
        <UserSessionRefundInvoiceModal
          closeModal={closeRefundInvoiceModal}
          selectedRefundInvoice={selectedRefundInvoice}
        />
      </dialog>
    </div>
  );
};

// Payment and Refund Prop Validation
// Payment and Refund Prop Validation
UserSessionInvoice.propTypes = {
  SessionRefundInvoicesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      stripePaymentID: PropTypes.string,
      cardHolder: PropTypes.string,
      paymentMethod: PropTypes.string,
      sessionInfo: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          trainer: PropTypes.string,
          trainerId: PropTypes.string,
          totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          paidAt: PropTypes.string,
          sessions: PropTypes.arrayOf(PropTypes.string),
        })
      ),
    })
  ).isRequired,

  SessionPaymentInvoicesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      stripePaymentID: PropTypes.string,
      cardHolder: PropTypes.string,
      paymentMethod: PropTypes.string,
      sessionInfo: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          trainer: PropTypes.string,
          trainerId: PropTypes.string,
          totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          paidAt: PropTypes.string,
          sessions: PropTypes.arrayOf(PropTypes.string),
        })
      ),
    })
  ).isRequired,
};

export default UserSessionInvoice;
