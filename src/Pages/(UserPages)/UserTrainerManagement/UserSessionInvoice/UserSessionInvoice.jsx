import { useRef, useState } from "react";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaTriangleExclamation,
} from "react-icons/fa6";

// Import Utility
import { formatDate } from "../../../../Utility/formatDate";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Modal
import UserSessionRefundInvoiceModal from "./UserSessionRefundInvoiceModal/UserSessionRefundInvoiceModal";
import UserSessionPaymentInvoiceModal from "./UserSessionPaymentInvoiceModal/UserSessionPaymentInvoiceModal";

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

  const sortedPaymentInvoices = [...SessionPaymentInvoicesData].sort((a, b) => {
    return new Date(b?.BookingInfo?.paidAt) - new Date(a?.BookingInfo?.paidAt);
  });

  const sortedRefundInvoices = [...SessionRefundInvoicesData].sort(
    (a, b) => new Date(b.refundedAt) - new Date(a.refundedAt)
  );

  // Pagination
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [currentRefundPage, setCurrentRefundPage] = useState(1);
  const itemsPerPage = 6;

  const totalPaymentPages = Math.ceil(
    sortedPaymentInvoices.length / itemsPerPage
  );

  const currentPaymentData = sortedPaymentInvoices.slice(
    (currentPaymentPage - 1) * itemsPerPage,
    currentPaymentPage * itemsPerPage
  );

  const totalRefundPages = Math.ceil(
    sortedRefundInvoices.length / itemsPerPage
  );

  const currentRefundData = sortedRefundInvoices.slice(
    (currentRefundPage - 1) * itemsPerPage,
    currentRefundPage * itemsPerPage
  );

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
        <div className="flex gap-3 justify-center items-center text-xl md:text-2xl bg-[#A1662F] font-bold text-center border border-white text-white py-1">
          Session Payment Invoices
        </div>

        {/* Content */}
        {currentPaymentData?.length > 0 ? (
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
                  {currentPaymentData?.map((item, index) => (
                    <tr
                      key={`List_No_${item?._id}_${index}`}
                      className={`border-b bg-white hover:bg-gray-200 cursor-default`}
                    >
                      {/* Number */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {(currentPaymentPage - 1) * itemsPerPage + index + 1}
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

            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {currentPaymentData?.map((item, index) => (
                <div
                  key={`mobile_List_No_${item?._id}_${index}`}
                  className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-800">
                        # {(currentPaymentPage - 1) * itemsPerPage + index + 1}
                      </span>
                      <FaFileInvoiceDollar className="text-green-500 text-xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {formatDate(item?.BookingInfo?.paidAt)}
                    </span>
                  </div>

                  {/* Payment Id */}
                  <div className="flex text-sm gap-2 pb-2">
                    <dt className="font-medium">Payment ID : </dt>
                    <dd className="truncate">
                      {item?.stripePaymentID?.slice(0, 15)}...
                    </dd>
                  </div>

                  {/* Trainer Name */}
                  <div className="flex text-sm gap-2 pb-2">
                    <dt className="font-medium">Trainer :</dt>
                    <dd>{item?.BookingInfo?.trainer}</dd>
                  </div>

                  {/* Details Grid */}
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                    {/* Price */}
                    <div className="flex gap-2">
                      <dt className="font-medium">Price :</dt>
                      <dd>
                        {item?.BookingInfo?.totalPrice === "0.00" ||
                        item?.BookingInfo?.totalPrice === 0.0
                          ? "Free"
                          : `$ ${item?.BookingInfo?.totalPrice}`}
                      </dd>
                    </div>

                    {/* Sessions */}
                    <div className="flex gap-2">
                      <dt className="font-medium">Sessions :</dt>
                      <dd>{item?.BookingInfo?.sessions?.length}</dd>
                    </div>

                    {/* Duration */}
                    <div className="flex gap-2">
                      <dt className="font-medium">Duration: </dt>
                      <dd className="flex gap-1">
                        <p> {item?.BookingInfo?.durationWeeks} </p>
                        <p>
                          {item?.BookingInfo?.durationWeeks > 1
                            ? "Weeks"
                            : "Week"}
                        </p>
                      </dd>
                    </div>
                  </dl>

                  {/* Action */}
                  <div className="mt-6 flex justify-center">
                    <button
                      id={`view-details-btn-mobile-${item._id}`}
                      className="flex items-center gap-2 border-2 border-green-500 bg-green-50 hover:bg-green-100 rounded-full px-4 py-2 font-medium transition-transform transform hover:scale-105"
                      onClick={() => {
                        setSelectedPaymentInvoice(item);
                        modalPaymentRef.current?.showModal();
                      }}
                    >
                      <FaFileInvoiceDollar className="text-green-500" />
                      <span className="text-green-700">Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center items-center gap-4">
              <div className="join">
                {/* Previous Page Button */}
                <button
                  onClick={() =>
                    setCurrentPaymentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPaymentPage === 1}
                  className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                    currentPaymentPage === 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <FaAnglesLeft />
                </button>

                {/* Page Info */}
                <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                  Page {currentPaymentPage} / {totalPaymentPages}
                </span>

                {/* Next Page Button */}
                <button
                  onClick={() =>
                    setCurrentPaymentPage((prev) =>
                      Math.min(prev + 1, totalPaymentPages)
                    )
                  }
                  disabled={currentPaymentPage === totalPaymentPages}
                  className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                    currentPaymentPage === totalPaymentPages
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <FaAnglesRight />
                </button>
              </div>
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
        {currentRefundData.length > 0 ? (
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
                  {currentRefundData?.map((item, index) => (
                    <tr
                      key={`List_No_${item?._id}_${index}`}
                      className={`border-b bg-white hover:bg-gray-200 cursor-default`}
                    >
                      {/* Number */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {(currentRefundPage - 1) * itemsPerPage + index + 1}
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
                          <p>
                            {Number(
                              item.bookingDataForHistory.RefundAmount
                            ).toFixed(2)}{" "}
                            $
                          </p>
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
            <div className="md:hidden space-y-4">
              {currentRefundData?.map((item, index) => (
                <div
                  key={`mobile_refund_List_No_${item?._id}_${index}`}
                  className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-800">
                        # {(currentRefundPage - 1) * itemsPerPage + index + 1}
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

                  {/* Action */}
                  <div className="mt-6 flex justify-center">
                    <button
                      id={`view-refund-details-btn-mobile-${item._id}`}
                      className="flex items-center gap-2 border-2 border-red-500 bg-red-50 hover:bg-red-100 rounded-full px-4 py-2 font-medium transition-transform transform hover:scale-105"
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

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center items-center gap-4">
              <div className="join">
                {/* Previous Page Button */}
                <button
                  onClick={() =>
                    setCurrentRefundPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentRefundPage === 1}
                  className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                    currentRefundPage === 1
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <FaAnglesLeft />
                </button>

                {/* Page Info */}
                <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                  Page {currentRefundPage} / {totalRefundPages}
                </span>

                {/* Next Page Button */}
                <button
                  onClick={() =>
                    setCurrentRefundPage((prev) =>
                      Math.min(prev + 1, totalRefundPages)
                    )
                  }
                  disabled={currentRefundPage === totalRefundPages}
                  className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                    currentRefundPage === totalRefundPages
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <FaAnglesRight />
                </button>
              </div>
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
