// Import Icons
import { FaTriangleExclamation } from "react-icons/fa6";

// import Buttons
import ViewDetailsButton from "../ViewDetailsButton";

// import Utility
import { formatDate } from "../../../../Utility/formatDate";

// Import Basic User Info Component
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// import PropTypes
import PropTypes from "prop-types";

const TrainerScheduleHistoryCanceled = ({
  modalRef,
  sortedHistory,
  setSelectedBooking,
  getStatusBackgroundColor,
}) => {
  return (
    <div className="py-4 px-1">
      {/* Canceled Classes : Title */}
      <h3 className="bg-gray-800 text-xl font-semibold py-2 text-center border-b-2 border-gray-100 ">
        Canceled Classes
      </h3>

      {/* Canceled Classes : Content */}
      {sortedHistory?.length > 0 ? (
        <>
          {/** Filter out bookings with status "Ended" */}
          {(() => {
            const filteredHistory = sortedHistory.filter(
              (booking) => booking.status.toLowerCase() !== "ended"
            );

            return (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
                  <table className="min-w-full bg-white">
                    {/* Table Header */}
                    <thead className="bg-gray-800 text-white text-sm uppercase">
                      <tr>
                        {[
                          "Bookie",
                          "Booked At",
                          "Total Price",
                          "Duration",
                          "Status",
                          "Reason",
                          "Action",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 border border-white text-left"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="text-sm text-center text-gray-700">
                      {filteredHistory.map((booking) => {
                        const rowBg = getStatusBackgroundColor(booking.status);

                        return (
                          <tr
                            key={booking._id}
                            className={`transition-colors duration-200 border-b border-gray-500 ${rowBg}`}
                          >
                            {/* Booker Info */}
                            <td className="px-4 py-3 font-medium">
                              <TrainerBookingRequestUserBasicInfo
                                email={booking?.bookerEmail}
                              />
                            </td>

                            {/* Booked At */}
                            <td className="px-4 py-3">
                              {formatDate(booking.bookedAt)}
                            </td>

                            {/* Total Price */}
                            <td className="px-4 py-3">
                              {booking?.totalPrice === "free"
                                ? "Free"
                                : `$ ${booking?.totalPrice}`}
                            </td>

                            {/* Duration */}
                            <td className="px-4 py-3">
                              {booking.durationWeeks}{" "}
                              {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3 font-bold capitalize">
                              {booking.status}
                            </td>

                            {/* Reason */}
                            <td className="px-4 py-3 text-left font-semibold">
                              {booking.reason}
                            </td>

                            {/* Action */}
                            <td className="px-4 py-3">
                              <ViewDetailsButton
                                id={`view-details-btn-${booking._id}`}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  modalRef.current?.showModal();
                                }}
                                tooltip="View Detailed Booking Info"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden text-black">
                  {filteredHistory.map((booking) => {
                    const rowBg = getStatusBackgroundColor(booking.status);

                    return (
                      <div
                        key={booking._id}
                        className={`border border-gray-300 rounded-md shadow-sm p-4 bg-white space-y-2 ${rowBg}`}
                      >
                        {/* Booker Info */}
                        <div>
                          <TrainerBookingRequestUserBasicInfo
                            email={booking?.bookerEmail}
                          />
                        </div>

                        {/* Booked At */}
                        <div className="flex justify-between">
                          <span className="font-semibold">Booked At: </span>
                          {formatDate(booking.bookedAt)}
                        </div>

                        {/* Total Price */}
                        <div className="flex justify-between">
                          <span className="font-semibold">Total Price: </span>
                          {booking?.totalPrice === "free"
                            ? "Free"
                            : `$ ${booking?.totalPrice}`}
                        </div>

                        {/* Duration */}
                        <div className="flex justify-between">
                          <span className="font-semibold">Duration: </span>
                          {booking.durationWeeks}{" "}
                          {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                        </div>

                        {/* Status */}
                        <div className="flex justify-between">
                          <span className="font-semibold">Status: </span>
                          <span className="font-bold capitalize">
                            {booking.status}
                          </span>
                        </div>

                        {/* Reason */}
                        <div className="text-center bg-gray-200 py-1">
                          <p className="font-bold">Reason: </p>
                          <p>{booking.reason}</p>
                        </div>

                        {/* Action */}
                        <div className="flex justify-end">
                          <ViewDetailsButton
                            id={`view-details-btn-${booking._id}-mobile`}
                            onClick={() => {
                              setSelectedBooking(booking);
                              modalRef.current?.showModal();
                            }}
                            tooltip="View Detailed Booking Info"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </>
      ) : (
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500" />
          No Booking Canceled History Found.
        </div>
      )}
    </div>
  );
};

// Prop mValidation
TrainerScheduleHistoryCanceled.propTypes = {
  modalRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,

  sortedHistory: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      reason: PropTypes.string,
    })
  ).isRequired,

  setSelectedBooking: PropTypes.func.isRequired,

  getStatusBackgroundColor: PropTypes.func.isRequired,
};

export default TrainerScheduleHistoryCanceled;
