import { useRef, useState } from "react";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import RejectedClassReceptModal from "./RejectedClassReceptModal/RejectedClassReceptModal";

// Import Invoice Modal

const UserClassRefundInvoices = ({ UserClassRefundData }) => {
  const modalPaymentInvoiceRef = useRef(null);

  // Selected State Management
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-md md:text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> User Class Refund Invoices
        </p>
      </div>

      {/* Table */}
      {UserClassRefundData.length > 0 ? (
        <>
          {/* Table View */}
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300 text-black">
            <table className="min-w-full bg-white overflow-hidden">
              {/* Table Header */}
              <thead className="bg-gray-300 text-gray-700 text-left text-sm uppercase">
                <tr>
                  {[
                    "#",
                    "Class",
                    "Duration",
                    "Price ($)",
                    "Refund ($)",
                    "Dropped At",
                    "Reason",
                    "Status",
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
                {UserClassRefundData.map((item, index) => {
                  const { applicant } = item || {};
                  const { classesName, duration, totalPrice } = applicant || {};
                  return (
                    <tr key={item._id} className="border-b hover:bg-gray-100">
                      {/* Index */}
                      <td className="p-3 text-center">{index + 1}</td>

                      {/* Class Name */}
                      <td className="p-3">{classesName}</td>

                      {/* Duration */}
                      <td className="p-3">{duration}</td>

                      {/* Total Price */}
                      <td className="p-3 text-right">
                        $ {totalPrice.toFixed(2)}
                      </td>

                      {/* RefundPrice */}
                      <td className="p-3 text-right">
                        $ {item.refundAmount.toFixed(2)}
                      </td>

                      {/* Dropped At */}
                      <td className="p-3 text-center">
                        {new Date(
                          item.droppedAt || item.rejectedAt
                        ).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      {/* Reason */}
                      <td className="p-3 text-left">{item.reason}</td>

                      {/* Status */}
                      <td className="p-3 text-center">
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {item.status}
                        </span>
                      </td>

                      {/* Invoice Button */}
                      <td className="p-3 text-center">
                        <button
                          id={`class-refund-invoice-${item._id}`}
                          className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedRefundInvoice(item);
                            modalPaymentInvoiceRef.current?.showModal();
                          }}
                        >
                          <FaFileInvoiceDollar className="text-red-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#class-refund-invoice-${item._id}`}
                          content="View Refund Invoice"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden space-y-4 mt-4 text-black">
            {UserClassRefundData.map((item, idx) => {
              const { applicant } = item || {};
              const { classesName, duration, totalPrice } = applicant || {};
              return (
                <div
                  key={item._id}
                  className="border rounded-lg shadow-sm p-4 bg-white"
                >
                  {/* Header row */}
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      #{idx + 1} - {classesName}
                    </h4>
                    <span
                      className={`text-xs font-semibold px-5 py-2 rounded-full ${
                        item.status === "Accepted"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    {/* Duration */}
                    <p className="flex justify-between items-center">
                      <span className="font-medium">Duration:</span>{" "}
                      <span>{duration}</span>
                    </p>

                    {/* Price */}
                    <p className="flex justify-between items-center">
                      <span className="font-medium">Price:</span>
                      <span>$ {totalPrice?.toFixed(2)}</span>
                    </p>

                    {/* Refund Amount */}
                    <p className="flex justify-between items-center">
                      <span className="font-medium">Refunded:</span>{" "}
                      <span>$ {item.refundAmount?.toFixed(2)}</span>
                    </p>

                    {/* Dropped At */}
                    <p className="flex justify-between items-center">
                      <span className="font-medium">Dropped At:</span>{" "}
                      <span>
                        {new Date(
                          item.droppedAt || item.rejectedAt
                        ).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>

                    {/* Redone */}
                    <p className="flex justify-between items-center">
                      <span className="font-medium">Reason:</span> {item.reason}
                    </p>
                  </div>

                  {/* Refund Button */}
                  <div className="mt-3 text-right">
                    <button
                      id={`mobile-refund-invoice-${item._id}`}
                      className="inline-flex items-center gap-1 border-2 border-red-500 bg-red-100 hover:bg-red-200 text-red-500 px-3 py-1 rounded-full text-sm hover:scale-105 transition-transform"
                      onClick={() => {
                        setSelectedRefundInvoice(item);
                        modalPaymentInvoiceRef.current?.showModal();
                      }}
                    >
                      <FaFileInvoiceDollar />
                      Invoice
                    </button>
                    <Tooltip
                      anchorSelect={`#mobile-refund-invoice-${item._id}`}
                      content="View Refund Invoice"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
          No Refund Invoice Available
        </div>
      )}

      {/* Class Rejected Invoice Modal */}
      <dialog
        ref={modalPaymentInvoiceRef}
        id="Rejected_Class_Recept_Modal"
        className="modal"
      >
        <RejectedClassReceptModal SelectRefundInvoice={selectedRefundInvoice} />
      </dialog>
    </div>
  );
};

// Prop Validation
UserClassRefundInvoices.propTypes = {
  UserClassRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      applicant: PropTypes.shape({
        classesName: PropTypes.string,
        duration: PropTypes.string,
        totalPrice: PropTypes.number,
      }),
      refundAmount: PropTypes.number,
      droppedAt: PropTypes.string,
      reason: PropTypes.string,
      status: PropTypes.string,
    })
  ),
};

export default UserClassRefundInvoices;
