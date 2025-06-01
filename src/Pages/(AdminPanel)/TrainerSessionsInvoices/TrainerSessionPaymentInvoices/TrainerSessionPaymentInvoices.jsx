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
import UserSessionPaymentInvoiceModal from "../../../(UserPages)/UserTrainerManagement/UserSessionInvoice/UserSessionPaymentInvoiceModal/UserSessionPaymentInvoiceModal";

const TrainerSessionPaymentInvoices = ({ TrainerSessionPaymentData }) => {
  const modalPaymentInvoiceRef = useRef(null);

  // State for selected invoice (for the modal)
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);

  // Close modal and reset selected invoice
  const closePaymentInvoiceModal = () => {
    modalPaymentInvoiceRef.current?.close();
    setSelectedPaymentInvoice(null);
  };
  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Trainer Sessions Payment&apos;s
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
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Paid At</th>
              <th className="px-4 py-2 border">Card Holder</th>
              <th className="px-4 py-2 border">Payment ID</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {TrainerSessionPaymentData?.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {/* Serial Number */}
                <td className="px-4 py-2 border">{index + 1}</td>

                {/* |User Info */}
                <td className="border px-4 py-2">
                  <TrainerBookingRequestUserBasicInfo
                    email={item?.BookingInfo?.bookerEmail}
                  />
                </td>

                {/* Trainer Info */}
                <td className="border px-4 py-2">
                  <BookedTrainerBasicInfo
                    trainerID={item?.BookingInfo?.trainerId}
                    py={1}
                  />
                </td>

                {/* Total Price */}
                <td className="px-4 py-2 border">
                  {item?.BookingInfo?.totalPrice === "free"
                    ? "Free"
                    : `$ ${item.BookingInfo.totalPrice}`}
                </td>

                {/* Duration */}
                <td className="px-4 py-2 border">
                  {item?.BookingInfo?.durationWeeks === 1
                    ? "1 Week"
                    : `${item.BookingInfo.durationWeeks} Weeks`}
                </td>

                {/* Payment Time */}
                <td className="px-4 py-2 border">
                  {new Date(item.paymentTime).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>

                {/* Card Holder */}
                <td className="px-4 py-2 border">{item.cardHolder}</td>

                {/* Payment ID */}
                <td className="px-4 py-2 border">
                  <span title={item.stripePaymentID}>
                    {item.stripePaymentID.length > 12
                      ? `${item.stripePaymentID.slice(
                          0,
                          6
                        )}...${item.stripePaymentID.slice(-4)}`
                      : item.stripePaymentID}
                  </span>
                </td>

                {/* Action Button */}
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedPaymentInvoice(item);
                      modalPaymentInvoiceRef.current?.showModal();
                    }}
                    className="border-2 border-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                    id={`view-details-btn-${item._id}`}
                  >
                    <FaFileInvoiceDollar className="text-gray-500" />
                  </button>

                  {/* Tooltip for Button */}
                  <Tooltip
                    anchorSelect={`#view-details-btn-${item._id}`}
                    content="View Session Payment Invoice"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Invoice */}
      <dialog ref={modalPaymentInvoiceRef} className="modal">
        <UserSessionPaymentInvoiceModal
          closeModal={closePaymentInvoiceModal}
          selectedPaymentInvoice={selectedPaymentInvoice}
        />
      </dialog>
    </>
  );
};

// Prop Validation
TrainerSessionPaymentInvoices.propTypes = {
  TrainerSessionPaymentData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      cardHolder: PropTypes.string,
      paymentTime: PropTypes.string.isRequired,
      stripePaymentID: PropTypes.string.isRequired,
      BookingInfo: PropTypes.shape({
        bookerEmail: PropTypes.string.isRequired,
        trainerId: PropTypes.string.isRequired,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        durationWeeks: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default TrainerSessionPaymentInvoices;
