import { useRef, useState } from "react";

// import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import TierUpgradeRefundInvoiceModal from "./TierUpgradeRefundInvoiceModal/TierUpgradeRefundInvoiceModal";

const UserRefundInvoices = ({ UserTierUpgradeRefundData }) => {
  // Initializes a state variable for the selected booking.
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  // Create a ref for the modal
  const modalRefundInvoiceRef = useRef(null);

  // Close Modal Handler
  const closeRefundInvoiceModal = () => {
    modalRefundInvoiceRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedRefundInvoice(null);
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> User Refund Invoices
        </p>
      </div>

      {/* Content : User Tier Upgrade Refund Invoice */}
      {UserTierUpgradeRefundData.length > 0 ? (
        <>
          {/* User Tier Upgrade Refund Invoice : Desktop */}
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300 text-black">
            <table className="min-w-full bg-white overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-300 text-gray-700 text-left text-sm uppercase">
                <tr>
                  {[
                    "#",
                    "Refund ID",
                    "Linked Payment Receipt",
                    "Refund Amount",
                    "Refund Reason",
                    "Date/Time",
                    "Status",
                    "Action",
                  ].map((header, i) => (
                    <th
                      key={header}
                      className={`px-4 py-3 border-b border-gray-400 text-left${
                        i === 0 ? " border-r" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {UserTierUpgradeRefundData.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-100">
                    {/* Index */}
                    <td className="py-3 px-4 font-medium border-r">
                      {index + 1}
                    </td>

                    {/* Refund ID */}
                    <td className="py-3 px-4">
                      {item.RefundID.length > 10
                        ? `${item.RefundID.slice(0, 10)}...`
                        : item.RefundID}
                    </td>

                    {/* Linked Payment Receipt */}
                    <td className="py-3 px-4">
                      {item.linkedPaymentReceptID?.length > 10
                        ? `${item.linkedPaymentReceptID.slice(0, 10)}...`
                        : item.linkedPaymentReceptID || "N/A"}
                    </td>

                    {/* Refund Amount */}
                    <td className="py-3 px-4">${item.refundAmount}</td>

                    {/* Refund Reason */}
                    <td className="py-3 px-4">{item.refundedReason}</td>

                    {/* Date/Time */}
                    <td className="py-3 px-4">{item.dateTime}</td>

                    {/* Refunded Status */}
                    <td className="py-3 px-4">
                      {item.refunded ? (
                        <span className="text-green-600 font-semibold">
                          Refunded
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-2 border-r border-b border-gray-300">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          id={`view-details-btn-${item._id}`}
                          className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedRefundInvoice(item?.RefundID);
                            modalRefundInvoiceRef.current?.showModal();
                          }}
                        >
                          <FaFileInvoiceDollar className="text-red-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#view-details-btn-${item._id}`}
                          content="View Detailed Refund Invoice"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Tier Upgrade Refund Invoice : Mobile */}
          <div className="md:hidden space-y-4 text-black">
            {UserTierUpgradeRefundData.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow border border-gray-200"
              >
                {/* Invoice index Number */}
                <div className="text-sm font-semibold mb-2 bg-gray-400 py-3 px-2 text-white">
                  Invoice # {index + 1}
                </div>

                {/* Content */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm px-2">
                  {/* Refund ID */}
                  <div className="font-medium text-gray-600">Refund ID:</div>
                  <div>
                    {item.RefundID.length > 10
                      ? `${item.RefundID.slice(0, 10)}...`
                      : item.RefundID}
                  </div>

                  {/* Linked Payment Receipt */}
                  <div className="font-medium text-gray-600">
                    Linked Receipt:
                  </div>
                  <div>
                    {item.linkedPaymentReceptID?.length > 10
                      ? `${item.linkedPaymentReceptID.slice(0, 10)}...`
                      : item.linkedPaymentReceptID}
                  </div>

                  {/* Refund Amount */}
                  <div className="font-medium text-gray-600">
                    Refund Amount:
                  </div>
                  <div>${item.refundAmount}</div>

                  {/* Date/Time */}
                  <div className="font-medium text-gray-600">Date/Time:</div>
                  <div>{item.dateTime}</div>

                  {/* Refunded Status */}
                  <div className="font-medium text-gray-600">Status:</div>
                  <div>
                    {item.refunded ? (
                      <span className="text-green-600 font-semibold">
                        Refunded
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Refund Reason */}
                <div className="text-center py-2 space-y-2">
                  <p className="font-medium text-black">Refund Reason:</p>
                  <p>{item.refundedReason}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-center py-4">
                  <button
                    id={`mobile-view-details-btn-${item._id}`}
                    className="flex items-center gap-2 text-sm text-red-700 border-2 border-red-500 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-full transition-transform hover:scale-105"
                    onClick={() => {
                      setSelectedRefundInvoice(item?.RefundID);
                      modalRefundInvoiceRef.current?.showModal();
                    }}
                  >
                    <FaFileInvoiceDollar className="text-red-500" />
                    View Invoice
                  </button>
                  <Tooltip
                    anchorSelect={`#mobile-view-details-btn-${item._id}`}
                    content="View Detailed Refund Invoice"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Fallback display when no accepted bookings exist
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
          No Refund Invoice Available
        </div>
      )}

      {/* Payment success modal */}
      <dialog ref={modalRefundInvoiceRef} className="modal">
        <TierUpgradeRefundInvoiceModal
          RefundID={selectedRefundInvoice}
          Close={closeRefundInvoiceModal}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
UserRefundInvoices.propTypes = {
  UserTierUpgradeRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      RefundID: PropTypes.string.isRequired,
      linkedPaymentReceptID: PropTypes.string,
      refundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      refundedReason: PropTypes.string.isRequired,
      dateTime: PropTypes.string,
      refunded: PropTypes.bool.isRequired,
    })
  ),
};

export default UserRefundInvoices;
