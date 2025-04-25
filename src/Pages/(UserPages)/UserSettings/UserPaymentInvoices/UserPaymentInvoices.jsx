import { useRef, useState } from "react";

// import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Modals
import TierUpgradePaymentInvoiceModal from "./TierUpgradePaymentInvoiceModal/TierUpgradePaymentInvoiceModal";

const UserPaymentInvoices = ({ UserTierUpgradePayment }) => {
  // Initializes a state variable for the selected booking.
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);

  // Create a ref for the modal
  const modalPaymentInvoiceRef = useRef(null);

  // Close Modal Handler
  const closePaymentInvoiceModal = () => {
    modalPaymentInvoiceRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedPaymentInvoice(null);
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> User Payment Invoices
        </p>
      </div>

      {/* Content : User Tier Upgrade Payment Invoice */}
      {UserTierUpgradePayment.length > 0 ? (
        <>
          {/* User Tier Upgrade Payment Invoice : Desktop */}
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300 text-black">
            <table className="min-w-full bg-white overflow-hidden">
              {/* User Tier Upgrade Payment Invoice : Desktop : Header */}
              <thead className="bg-gray-300 text-gray-700 text-left text-sm uppercase">
                <tr>
                  {[
                    "#",
                    "Payment ID",
                    "Tier",
                    "Duration",
                    "Start Date",
                    "End Date",
                    "Total Price",
                    "Payment Method",
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

              {/* User Tier Upgrade Payment Invoice : Desktop : Body */}
              <tbody>
                {UserTierUpgradePayment.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-100">
                    {/* Index */}
                    <td className="py-3 px-4 font-medium border-r">
                      {index + 1}
                    </td>

                    {/* Stripe Payment ID */}
                    <td className="py-3 px-4">{item.stripePaymentID}</td>

                    {/* Tier */}
                    <td className="py-3 px-4 border-l">{item.tier}</td>

                    {/* Duration */}
                    <td className="py-3 px-4">{item.duration}</td>

                    {/* Start Date */}
                    <td className="py-3 px-4">{item.startDate}</td>

                    {/* End Date */}
                    <td className="py-3 px-4">{item.endDate}</td>

                    {/* Total Price */}
                    <td className="py-3 px-4">${item.totalPrice}</td>

                    {/* Payment Method */}
                    <td className="py-3 px-4">{item.paymentMethod}</td>

                    {/* Payed or Not */}
                    <td className="py-3 px-4">
                      {item.Payed ? (
                        <span className="text-green-600 font-semibold">
                          Paid
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* Invoice Button */}
                    <td className="px-4 py-2 border-r border-b border-gray-300">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          id={`view-details-btn-${item._id}`} // Unique ID for each button
                          className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedPaymentInvoice(item?.paymentID); // use stripePaymentID consistently
                            modalPaymentInvoiceRef.current?.showModal();
                          }}
                        >
                          <FaFileInvoiceDollar className="text-green-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#view-details-btn-${item._id}`}
                          content="View Detailed Payment Invoice"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Tier Upgrade Payment Invoice : Mobile */}
          <div className="md:hidden space-y-4 text-black">
            {UserTierUpgradePayment.map((item, index) => (
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
                  {/* Payment ID */}
                  <div className="font-medium text-gray-600">Payment ID:</div>
                  <div>{item.stripePaymentID?.slice(0, 15)}...</div>

                  {/* Tier */}
                  <div className="font-medium text-gray-600">Tier:</div>
                  <div>{item.tier}</div>

                  {/* Duration */}
                  <div className="font-medium text-gray-600">Duration:</div>
                  <div>{item.duration}</div>

                  {/* Start Date */}
                  <div className="font-medium text-gray-600">Start Date:</div>
                  <div>{item.startDate}</div>

                  {/* End Date */}
                  <div className="font-medium text-gray-600">End Date:</div>
                  <div>{item.endDate}</div>

                  {/* Total Price */}
                  <div className="font-medium text-gray-600">Total Price:</div>
                  <div>${item.totalPrice}</div>

                  {/* Payment Method */}
                  <div className="font-medium text-gray-600">
                    Payment Method:
                  </div>
                  <div>{item.paymentMethod}</div>

                  {/* Status */}
                  <div className="font-medium text-gray-600">Status:</div>
                  <div>
                    {item.Payed ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Unpaid</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center py-4">
                  <button
                    id={`mobile-view-details-btn-${item._id}`}
                    className="flex items-center gap-2 text-sm text-green-700 border-2 border-green-500 bg-green-100 hover:bg-green-200 px-3 py-2 rounded-full transition-transform hover:scale-105"
                    onClick={() => {
                      setSelectedPaymentInvoice(item?.paymentID);
                      modalPaymentInvoiceRef.current?.showModal();
                    }}
                  >
                    <FaFileInvoiceDollar className="text-green-500" />
                    View Invoice
                  </button>
                  <Tooltip
                    anchorSelect={`#mobile-view-details-btn-${item._id}`}
                    content="View Detailed Payment Invoice"
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
          No Payment Invoice Available
        </div>
      )}

      {/* Payment success modal */}
      <dialog ref={modalPaymentInvoiceRef} className="modal">
        <TierUpgradePaymentInvoiceModal
          PaymentID={selectedPaymentInvoice}
          Close={closePaymentInvoiceModal}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
UserPaymentInvoices.propTypes = {
  UserTierUpgradePayment: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      stripePaymentID: PropTypes.string.isRequired,
      paymentID: PropTypes.string.isRequired,
      tier: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      paymentMethod: PropTypes.string.isRequired,
      Payed: PropTypes.bool.isRequired,
    })
  ),
};

export default UserPaymentInvoices;
