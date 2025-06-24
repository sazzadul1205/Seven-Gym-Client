import { useRef, useState } from "react";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { formatDate } from "../../../../Utility/formatDate";
import UserSessionPaymentInvoiceModal from "../../UserTrainerManagement/UserSessionInvoice/UserSessionPaymentInvoiceModal/UserSessionPaymentInvoiceModal";

// Import Modals

const UserSessionPayedInvoices = ({ SessionPaymentInvoicesData }) => {
  const modalPaymentRef = useRef(null);

  // Local Selected State
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);

  // Close Modal Handler
  const closePaymentInvoiceModal = () => {
    modalPaymentRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedPaymentInvoice(null);
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen text-black">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-3">
        <p className="flex gap-2 items-center text-md md:text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> Session Payment Invoices
        </p>
      </div>

      {/* Content */}
      {SessionPaymentInvoicesData?.length > 0 ? (
        <>
          {/* Table View */}
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300 text-black">
            <table className="min-w-full bg-white overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-300 text-gray-700 text-left text-sm uppercase">
                <tr>
                  {[
                    "No",
                    "Payment ID",
                    "Trainer",
                    "Paid At",
                    "Total Price",
                    "Sessions",
                    "Durations",
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
                {SessionPaymentInvoicesData?.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-100">
                    {/* Number */}
                    <td className="px-3 py-3">{index + 1}</td>

                    {/* Session Payment Id */}
                    <td className="px-3 py-3">{item?.stripePaymentID}</td>

                    {/* Session Trainer Name */}
                    <td className="px-3 py-3">{item?.BookingInfo?.trainer}</td>

                    {/* Session Paid At */}
                    <td className="px-3 py-3">
                      {formatDate(item?.BookingInfo?.paidAt)}
                    </td>

                    {/* Session Price */}
                    <td className="px-3 py-3">
                      {item?.BookingInfo?.totalPrice === "0.00" ||
                      item?.BookingInfo?.totalPrice === 0.0
                        ? "Free"
                        : `$ ${item?.BookingInfo?.totalPrice}`}
                    </td>

                    {/* Session Length */}
                    <td className="px-3 py-3">
                      {item?.BookingInfo?.sessions?.length}
                    </td>

                    {/* Session Length */}
                    <td className="px-3 py-3">
                      {item?.BookingInfo?.durationWeeks}{" "}
                      {item?.BookingInfo?.durationWeeks > 1 ? "Weeks" : "Week"}
                    </td>

                    {/* Invoice Button */}
                    <td className="px-3 py-3">
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
          <div className="md:hidden space-y-4 py-2">
            {SessionPaymentInvoicesData?.map((item, index) => (
              <div
                key={`mobile_List_No_${item?._id}_${index}`}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-800">
                      # {index + 1}
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
                <div className="mt-2 flex justify-center">
                  <button
                    id={`view-details-btn-mobile-${item._id}`}
                    className="flex items-center gap-2 border-2 border-green-500 bg-green-50 hover:bg-green-100 rounded-full px-8 py-2 font-medium transition-transform transform hover:scale-105"
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

      {/* User Trainer Booking Info Modal */}
      <dialog ref={modalPaymentRef} className="modal">
        <UserSessionPaymentInvoiceModal
          closeModal={closePaymentInvoiceModal}
          selectedPaymentInvoice={selectedPaymentInvoice}
        />
      </dialog>
    </div>
  );
};

// Payment and Refund Prop Validation
UserSessionPayedInvoices.propTypes = {
  SessionPaymentInvoicesData: PropTypes.arrayOf(
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

export default UserSessionPayedInvoices;
