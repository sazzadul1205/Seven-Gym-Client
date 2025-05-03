// import Icons
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Button
import ViewDetailsButton from "../ViewDetailsButton";

// Import Utility
import { formatDate } from "../../../../Utility/formatDate";
import { calculateEndAt } from "../../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/calculateEndAt";
import { formatDateWithTextMonth } from "../../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/formatDateWithTextMonth ";

// import Basic info
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// import PropTypes
import PropTypes from "prop-types";

const TrainerScheduleHistoryCompleted = ({
  modalRef,
  sortedHistory,
  setSelectedBooking,
  getStatusBackgroundColor,
  TrainerBookingHistoryData,
}) => {
  return (
    <div className="py-4 px-1">
      {/* Completed Classes : Title */}
      <h3 className="bg-gray-800 text-xl font-semibold py-2 text-center border-b-2 border-gray-100 ">
        Completed Classes
      </h3>

      {/* Completed Classes: Content */}
      {sortedHistory?.length > 0 ? (
        <>
          {/* Accepted Pending Classes : Table  */}
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
            <table className="min-w-full bg-white">
              {/* Accepted Bookings : Header */}
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  {[
                    "Bookie",
                    "Paid At",
                    "Start At",
                    "Total Price",
                    "Duration",
                    "Status",
                    "End At",
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

              {/* Accepted Bookings : Body */}
              <tbody className="text-sm text-gray-700">
                {[...TrainerBookingHistoryData]
                  // Filter So Only Ended are Shown
                  .filter((booking) => booking?.status === "Ended")

                  // Sort By Recent
                  .sort((a, b) => {
                    const parseCustomDate = (dateStr) => {
                      const [datePart, timePart] = dateStr.split("T");
                      const [day, month, year] = datePart
                        .split("-")
                        .map(Number);
                      const [hour, minute] = timePart.split(":").map(Number);
                      return new Date(year, month - 1, day, hour, minute);
                    };
                    return (
                      parseCustomDate(b.bookedAt) - parseCustomDate(a.bookedAt)
                    );
                  })

                  // Add index to display serial number
                  .map((booking) => {
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
                          {formatDate(booking.paidAt)}
                        </td>

                        {/* Start At */}
                        <td className="px-4 py-3">
                          {formatDateWithTextMonth(booking.startAt)}
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
                        <td className="px-4 py-3 font-bold">Completed</td>

                        {/* Ended At */}
                        <td className="px-4 py-3 text-center font-semibold">
                          {formatDateWithTextMonth(
                            calculateEndAt(
                              booking.startAt,
                              booking.durationWeeks
                            )
                          )}
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

          {/* Ended Bookings : Mobile View */}
          <div className="md:hidden text-black">
            {[...TrainerBookingHistoryData]
              // Show Only Ended
              .filter((booking) => booking?.status === "Ended")

              // Sort by Most Recent
              .sort((a, b) => {
                const parseCustomDate = (dateStr) => {
                  const [datePart, timePart] = dateStr.split("T");
                  const [day, month, year] = datePart.split("-").map(Number);
                  const [hour, minute] = timePart.split(":").map(Number);
                  return new Date(year, month - 1, day, hour, minute);
                };
                return (
                  parseCustomDate(b.bookedAt) - parseCustomDate(a.bookedAt)
                );
              })

              .map((booking) => {
                const rowBg = getStatusBackgroundColor(booking.status);

                return (
                  <div
                    key={booking._id}
                    className={`border border-gray-600 shadow-sm p-4 bg-white space-y-2 ${rowBg}`}
                  >
                    {/* Booker Info */}
                    <div>
                      <TrainerBookingRequestUserBasicInfo
                        email={booking?.bookerEmail}
                      />
                    </div>

                    {/* Paid At */}
                    <div className="flex justify-between">
                      <span className="font-semibold">Paid At: </span>
                      {formatDate(booking.paidAt)}
                    </div>

                    {/* Start At */}
                    <div className="flex justify-between">
                      <span className="font-semibold">Start At: </span>
                      {formatDateWithTextMonth(booking.startAt)}
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
                      <span className="font-bold text-green-500">
                        Completed
                      </span>
                    </div>

                    {/* End At */}
                    <div className="flex justify-between">
                      <span className="font-semibold">Ended At: </span>
                      {formatDateWithTextMonth(
                        calculateEndAt(booking.startAt, booking.durationWeeks)
                      )}
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
      ) : (
        // Fallback display when no Completed bookings exist
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500" />
          No Booking Completed Found.
        </div>
      )}
    </div>
  );
};

// Prop Validation
TrainerScheduleHistoryCompleted.propTypes = {
  modalRef: PropTypes.shape({
    current: PropTypes.shape({
      showModal: PropTypes.func,
    }),
  }),
  sortedHistory: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      paidAt: PropTypes.string,
      startAt: PropTypes.string,
      durationWeeks: PropTypes.number.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      bookedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedBooking: PropTypes.func.isRequired,
  getStatusBackgroundColor: PropTypes.func.isRequired,
  TrainerBookingHistoryData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      paidAt: PropTypes.string,
      startAt: PropTypes.string,
      durationWeeks: PropTypes.number.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      bookedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TrainerScheduleHistoryCompleted;
