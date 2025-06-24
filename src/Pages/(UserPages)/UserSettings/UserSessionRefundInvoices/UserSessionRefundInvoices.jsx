import { useRef, useState } from "react";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { formatDate } from "../../../../Utility/formatDate";

// Import Modals
import UserSessionRefundInvoiceModal from "../../UserTrainerManagement/UserSessionInvoice/UserSessionRefundInvoiceModal/UserSessionRefundInvoiceModal";

const UserSessionRefundInvoices = ({ SessionRefundInvoicesData }) => {
  const modalRefundRef = useRef(null);

  // Local Selected State
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  // Close Modal Handler
  const closeRefundInvoiceModal = () => {
    modalRefundRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedRefundInvoice(null);
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen text-black">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-3">
        <p className="flex gap-2 items-center text-md md:text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> Session Refund Invoices
        </p>
      </div>

      {/* Content */}
      {SessionRefundInvoicesData.length > 0 ? (
        <>
          {/* Table View */}
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300 text-black">
            <table className="min-w-full bg-white overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-300 text-gray-700 text-left text-sm uppercase">
                <tr>
                  {[
                    "No",
                    "Refund ID",
                    "Trainer",
                    "Refund Amount",
                    "Refund At",
                    "Sessions",
                    "Duration",
                    "Reason",
                    "Action",
                  ].map((heading, i) => (
                    <th
                      key={heading}
                      className={`px-4 py-3 border-b border-gray-400 text-left${
                        i === 0 ? " border-r" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {SessionRefundInvoicesData?.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-100">
                    {/* Number */}
                    <td className="px-3 py-3">{index + 1}</td>

                    {/* Session Payment Id */}
                    <td className="px-3 py-3">{item?.refundID}</td>

                    {/* Session Trainer Name */}
                    <td className="px-3 py-3">
                      {item?.bookingDataForHistory?.trainer}
                    </td>

                    {/* Session Refund Amount */}
                    <td className="px-3 py-3">
                      <p className="flex gap-4">
                        <span>
                          {item?.bookingDataForHistory?.RefundPercentage}
                        </span>{" "}
                        <span className="flex">
                          (
                          {item?.bookingDataForHistory?.RefundAmount !==
                            undefined && (
                            <p>
                              {Number(
                                item.bookingDataForHistory.RefundAmount
                              ).toFixed(2)}{" "}
                              $
                            </p>
                          )}
                          )
                        </span>
                      </p>
                    </td>

                    {/* Session Price */}
                    <td className="px-3 py-3">
                      {formatDate(item?.refundedAt)}
                    </td>

                    {/* Session Length */}
                    <td className="px-3 py-3">
                      {item?.bookingDataForHistory?.sessions?.length}
                    </td>

                    {/* Session Duration */}
                    <td className="px-3 py-3">
                      {item?.bookingDataForHistory?.durationWeeks}{" "}
                      {item?.bookingDataForHistory?.durationWeeks === 1
                        ? "Week"
                        : "Weeks"}
                    </td>

                    {/* Session Reason */}
                    <td className="px-3 py-3">
                      {item?.bookingDataForHistory?.reason}
                    </td>

                    {/* Invoice Button */}
                    <td className="px-3 py-3">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          id={`view-details-btn-${item._id}`} // Unique ID for each button
                          className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedRefundInvoice(item);
                            modalRefundRef.current?.showModal();
                          }}
                        >
                          <FaFileInvoiceDollar className="text-red-500" />
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

          {/* Mobile View  */}
          <div className="md:hidden space-y-4 py-2">
            {SessionRefundInvoicesData?.map((item, index) => (
              <div
                key={`mobile_refund_List_No_${item?._id}_${index}`}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-800">
                      # {index + 1}
                    </span>
                    <FaFileInvoiceDollar className="text-red-500 text-xl" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    {formatDate(item?.refundedAt)}
                  </span>
                </div>

                {/* Payment Id */}
                <div className="flex text-sm gap-2 pb-2">
                  <dt className="font-medium">Refund ID : </dt>
                  <dd className="truncate">
                    {item?.refundID?.slice(0, 15)}...
                  </dd>
                </div>

                {/* Trainer Name */}
                <div className="flex text-sm gap-2 pb-2">
                  <dt className="font-medium">Trainer :</dt>
                  <dd>{item?.bookingDataForHistory?.trainer}</dd>
                </div>

                {/* Details Grid */}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                  {/* Refund Percentage */}
                  <div className="flex gap-2">
                    <dt className="font-medium">Refund :</dt>
                    <dd>{item?.bookingDataForHistory?.RefundPercentage}</dd>
                  </div>

                  {/* Amount */}
                  <div className="flex gap-2">
                    <dt className="font-medium">Amount</dt>
                    <dd>
                      {item?.bookingDataForHistory?.RefundAmount !== undefined
                        ? `${Number(
                            item.bookingDataForHistory.RefundAmount
                          ).toFixed(2)}`
                        : "N/A"}
                    </dd>
                  </div>

                  {/* Sessions */}
                  <div className="flex gap-2">
                    <dt className="font-medium">Sessions</dt>
                    <dd>{item?.bookingDataForHistory?.sessions?.length}</dd>
                  </div>

                  {/* Duration */}
                  <div className="flex gap-2">
                    <dt className="font-medium">Duration</dt>
                    <dd>
                      {item?.bookingDataForHistory?.durationWeeks}{" "}
                      {item?.bookingDataForHistory?.durationWeeks === 1
                        ? "Week"
                        : "Weeks"}
                    </dd>
                  </div>
                </dl>

                {/* Reason */}
                <div className="">
                  <dt className="text-center font-medium">Reason</dt>
                  <dd className="text-center text-sm">
                    {item?.bookingDataForHistory?.reason}
                  </dd>
                </div>

                {/* Action */}
                <div className="mt-2 flex justify-center">
                  <button
                    id={`view-refund-details-btn-mobile-${item._id}`}
                    className="flex items-center gap-2 border-2 border-red-500 bg-red-50 hover:bg-red-100 rounded-full px-8 py-2 font-medium transition-transform transform hover:scale-105"
                    onClick={() => {
                      setSelectedRefundInvoice(item);
                      modalRefundRef.current?.showModal();
                    }}
                  >
                    <FaFileInvoiceDollar className="text-red-500" />
                    <span className="text-red-700">Details</span>
                  </button>
                </div>
              </div>
            ))}
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
UserSessionRefundInvoices.propTypes = {
  SessionRefundInvoicesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
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
  ),
};

export default UserSessionRefundInvoices;
