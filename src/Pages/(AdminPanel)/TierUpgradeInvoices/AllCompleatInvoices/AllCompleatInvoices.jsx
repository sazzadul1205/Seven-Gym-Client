import { useState } from "react";
import PropTypes from "prop-types";

// Import icons for pagination arrows
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import component to display user basic info by email
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

const AllCompleatInvoices = ({ CompletedTierPaymentData }) => {
  // Local state to track current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fixed number of items per page for pagination
  const itemsPerPage = 10;

  // Calculate total number of pages needed
  const totalPages = Math.ceil(
    (CompletedTierPaymentData?.length || 0) / itemsPerPage
  );

  // Slice the data array to only show items for the current page
  const currentData = CompletedTierPaymentData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Completed Tier Upgrade
        </h3>
      </div>

      {Array.isArray(CompletedTierPaymentData) &&
      CompletedTierPaymentData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Table for displaying invoices */}
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                {/* Table headers */}
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Tier</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Total ($)</th>
                <th className="px-4 py-2 border">Payed</th>
                <th className="px-4 py-2 border">Payment Time</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Render current page data rows */}
              {currentData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Serial number based on page and index */}
                  <td className="border px-4 py-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* Email with user basic info component */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo email={item.email} />
                  </td>

                  {/* Other data columns */}
                  <td className="border px-4 py-2">{item.tier}</td>
                  <td className="border px-4 py-2">{item.duration}</td>
                  <td className="border px-4 py-2">{item.startDate}</td>
                  <td className="border px-4 py-2">{item.endDate}</td>

                  {/* Format price to 2 decimal places */}
                  <td className="border px-4 py-2">
                    ${item.totalPrice.toFixed(2)}
                  </td>

                  {/* Paid status shown as Yes/No */}
                  <td className="border px-4 py-2">
                    {item.Payed ? "Yes" : "No"}
                  </td>

                  {/* Format paymentTime date */}
                  <td className="border px-4 py-2">
                    {new Date(item.paymentTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  {/* Action button (currently logs ID on click) */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => console.log("Clicked on", item._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="join">
              {/* Previous page button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesLeft />
              </button>

              {/* Page indicator */}
              <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                Page {currentPage} / {totalPages}
              </span>

              {/* Next page button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Fallback message if no data available
        <div className=" bg-gray-200  p-4">
          <p className="text-center font-semibold text-black">
            No refund data available.
          </p>
        </div>
      )}
    </div>
  );
};

// PropTypes validation for better reliability and catching issues early
AllCompleatInvoices.propTypes = {
  CompletedTierPaymentData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      tier: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      Payed: PropTypes.bool.isRequired,
      paymentTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ),
};

export default AllCompleatInvoices;
