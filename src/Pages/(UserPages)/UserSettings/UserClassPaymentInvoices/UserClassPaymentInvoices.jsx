import { useRef, useState } from "react";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Invoice Modal
import PayedClassReceptModal from "../../UserClassManagement/UserClassManagementAccepted/PayedClassReceptModal/PayedClassReceptModal";

const UserClassPaymentInvoices = ({ UserClassPaymentData }) => {
  const modalPaymentInvoiceRef = useRef(null);

  // Selected State Management
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-md md:text-xl font-semibold italic text-white">
          <FaFileInvoiceDollar /> User Class Payment Invoices
        </p>
      </div>

      {/* Table */}
      {/* Content : User Tier Upgrade Refund Invoice */}
      {UserClassPaymentData.length > 0 ? (
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
                    "Payment ID",
                    "Method",
                    "Paid At",
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
                {UserClassPaymentData.map((item, idx) => {
                  const applicant = item.applicant || {};
                  const { classesName, duration, totalPrice } = applicant;
                  return (
                    <tr key={item._id} className="border-b hover:bg-gray-100">
                      {/* Index */}
                      <td className="p-3">{idx + 1}</td>

                      {/* Class Name */}
                      <td className="p-3">{classesName}</td>

                      {/* Duration */}
                      <td className="p-3">{duration}</td>

                      {/* Price */}
                      <td className="p-3 ">$ {totalPrice?.toFixed(2)}</td>

                      {/* Stripe Payment Id */}
                      <td className="p-3 text-xs break-all">
                        {item.stripePaymentID}
                      </td>

                      {/* Payment Method */}
                      <td className="p-3">{item.paymentMethod}</td>

                      {/* Payment Time */}
                      <td className="p-3">
                        {new Date(item.paidAt).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Accepted"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Invoice Button */}
                      <td className="px-4 py-2 border-r border-b border-gray-300">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            id={`view-class-payment-invoice-btn-${item._id}`}
                            className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setSelectedPaymentInvoice(item);
                              modalPaymentInvoiceRef.current?.showModal();
                            }}
                          >
                            <FaFileInvoiceDollar className="text-green-500" />
                          </button>
                          <Tooltip
                            anchorSelect={`#view-class-payment-invoice-btn-${item._id}`}
                            content="View Class Payment Invoice"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Table View */}
          <div className="md:hidden px-3 py-4 space-y-4">
            {UserClassPaymentData.map((item, idx) => {
              const applicant = item.applicant || {};
              const { classesName, duration, totalPrice } = applicant;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-300"
                >
                  {/* Header row */}
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      #{idx + 1} - {classesName}
                    </h4>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        item.status === "Accepted"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Detail rows */}
                  <div className="text-sm text-gray-700 space-y-1">
                    {/* Duration */}
                    <p>
                      <strong>Duration:</strong> {duration}
                    </p>
                    {/* Price */}
                    <p>
                      <strong>Price:</strong> ${totalPrice?.toFixed(2)}
                    </p>
                    {/* Payment ID */}
                    <p className="break-all">
                      <strong>Payment ID:</strong>{" "}
                      {item.stripePaymentID?.length > 20
                        ? `${item.stripePaymentID.slice(0, 20)}.....`
                        : item.stripePaymentID}
                    </p>
                    {/* Payment Method */}
                    <p>
                      <strong>Method:</strong> {item.paymentMethod}
                    </p>
                    {/* Payed At */}
                    <p>
                      <strong>Paid At:</strong>{" "}
                      {new Date(item.paidAt).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-3 flex justify-end">
                    <button
                      id={`mobile-invoice-btn-${item._id}`}
                      onClick={() => {
                        setSelectedPaymentInvoice(item);
                        modalPaymentInvoiceRef.current?.showModal();
                      }}
                      className="flex items-center gap-2 border-2 border-green-500 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-full text-sm text-green-700 font-semibold transition-transform hover:scale-105"
                    >
                      <FaFileInvoiceDollar />
                      View Invoice
                    </button>
                    <Tooltip
                      anchorSelect={`#mobile-invoice-btn-${item._id}`}
                      content="View Class Payment Invoice"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Fallback display when no accepted bookings exist
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
          No Payment Invoice Available
        </div>
      )}

      {/* Class Payment Invoice Modal */}
      <dialog
        ref={modalPaymentInvoiceRef}
        id="Payed_Class_Recept_Modal"
        className="modal"
      >
        <PayedClassReceptModal paymentSuccessData={selectedPaymentInvoice} />
      </dialog>
    </div>
  );
};

// Prop Validation
UserClassPaymentInvoices.propTypes = {
  UserClassPaymentData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      applicant: PropTypes.shape({
        _id: PropTypes.string,
        classesName: PropTypes.string,
        duration: PropTypes.string,
        totalPrice: PropTypes.number,
        submittedDate: PropTypes.string,
        applicantData: PropTypes.shape({
          Userid: PropTypes.string,
          email: PropTypes.string,
          name: PropTypes.string,
          phone: PropTypes.string,
        }),
      }),
      status: PropTypes.string,
      paid: PropTypes.bool,
      paymentMethod: PropTypes.string,
      stripePaymentID: PropTypes.string,
      paidAt: PropTypes.string,
    })
  ),
};

export default UserClassPaymentInvoices;
