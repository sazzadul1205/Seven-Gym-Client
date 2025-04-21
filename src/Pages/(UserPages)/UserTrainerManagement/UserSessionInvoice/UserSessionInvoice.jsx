import { useRef, useState } from "react";

// Import Icons
import { LuCircleDotDashed } from "react-icons/lu";
import { FaFileInvoiceDollar } from "react-icons/fa";

// Import Utility
import { formatDate } from "../../../../Utility/formatDate";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Modal
import UserSessionPaymentInvoiceModal from "./UserSessionPaymentInvoiceModal/UserSessionPaymentInvoiceModal";

const UserSessionInvoice = ({
  SessionRefundInvoicesData,
  SessionPaymentInvoicesData,
}) => {
  // Initializes a state variable for the selected booking.
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);

  // Create a ref for the modal
  const modalRef = useRef(null);
  console.log("Session Refund Invoices Data : ", SessionRefundInvoicesData);
  console.log("Session Payment Invoices Data : ", SessionPaymentInvoicesData);

  // Close Modal Handler
  const closeModal = () => {
    modalRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedPaymentInvoice(null);
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

      {/* Bookings List */}
      <div className="py-1">
        {/* Title */}
        <div className="flex gap-3 justify-center items-center text-2xl bg-[#A1662F] font-bold text-center border border-white text-white py-1">
          <LuCircleDotDashed />
          Session Payment Invoices
          <LuCircleDotDashed />
        </div>
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
                      "Payment ID",
                      "Trainer",
                      "Total Price",
                      "Paid At",
                      "Sessions",
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
                        {index + 1}
                      </td>

                      {/* Session Payment Id */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {item?.stripePaymentID}
                      </td>

                      {/* Session Trainer Name */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {item?.sessionInfo?.trainer}
                      </td>

                      {/* Session Paid At */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        {formatDate(item?.sessionInfo?.paidAt)}
                      </td>

                      {/* Session Price */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {item?.sessionInfo?.totalPrice === "0.00" ||
                        item?.sessionInfo?.totalPrice === 0.0
                          ? "Free"
                          : `$ ${item?.sessionInfo?.totalPrice}`}
                      </td>

                      {/* Session Length */}
                      <td className="px-4 py-2 text-center border-r border-b border-gray-300">
                        {item?.sessionInfo?.sessions?.length}
                      </td>

                      {/* Invoice Button */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            id={`view-details-btn-${item._id}`} // Unique ID for each button
                            className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setSelectedPaymentInvoice(item);
                              modalRef.current?.showModal();
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
          <p className="text-center text-lg font-semibold text-black py-5 bg-white">
            There are no Payment made this Far
          </p>
        )}
      </div>

      {/* User Trainer Booking Info Modal */}
      <dialog
        ref={modalRef}
        id="User_Trainer_Booking_Info_Sessions_Modal"
        className="modal"
      >
        <UserSessionPaymentInvoiceModal
          closeModal={closeModal}
          selectedPaymentInvoice={selectedPaymentInvoice}
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
      sessionInfo: PropTypes.shape({
        _id: PropTypes.string,
        trainer: PropTypes.string,
        trainerId: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        paidAt: PropTypes.string,
        sessions: PropTypes.arrayOf(PropTypes.string),
      }),
    })
  ).isRequired,
  SessionPaymentInvoicesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      stripePaymentID: PropTypes.string,
      cardHolder: PropTypes.string,
      paymentMethod: PropTypes.string,
      sessionInfo: PropTypes.shape({
        _id: PropTypes.string,
        trainer: PropTypes.string,
        trainerId: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        paidAt: PropTypes.string,
        sessions: PropTypes.arrayOf(PropTypes.string),
      }),
    })
  ).isRequired,
};

export default UserSessionInvoice;
