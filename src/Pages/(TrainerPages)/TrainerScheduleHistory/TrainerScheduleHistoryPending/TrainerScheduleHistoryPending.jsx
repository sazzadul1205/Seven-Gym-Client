// Import Icons
import { FaTriangleExclamation } from "react-icons/fa6";

// import Buttons
import ViewDetailsButton from "../ViewDetailsButton";

// import Utility
import { formatDateWithTextMonth } from "../../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/formatDateWithTextMonth ";
import { calculateEndAt } from "../../TrainerScheduleParticipant/TrainerScheduleParticipantAccepted/calculateEndAt";
import { formatDate } from "../../../../Utility/formatDate";

// Import Basic User Info Component
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// import PropTypes
import PropTypes from "prop-types";

const TrainerScheduleHistoryPending = ({
  TrainerBookingAcceptedData,
  setSelectedBooking,
  modalRef,
}) => {
  return (
    <div className="py-4 px-1">
      {/* Accepted Pending Classes : Title */}
      <h3 className="bg-gray-800 text-xl font-semibold py-2 text-center border-b-2 border-gray-100 ">
        Pending Classes
      </h3>

      {/* Accepted Pending Classes : Content */}
      {TrainerBookingAcceptedData.length > 0 ? (
        <>
          {/* Accepted Pending Classes : Table  */}
          <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
            <table className="min-w-full bg-white">
              {/* Accepted Bookings Header */}
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  {[
                    "Booker",
                    "Accepted At",
                    "Total Price",
                    "Duration",
                    "Status",
                    "Start At",
                    "End At",
                    "Actions",
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

              {/* Accepted Bookings Body */}
              <tbody className="text-sm text-gray-700">
                {TrainerBookingAcceptedData.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`transition-colors duration-200 hover:bg-gray-100 border-b border-gray-500 ${
                      !booking.startAt ? "bg-green-100 hover:bg-green-50" : ""
                    }`}
                  >
                    {/* Booker Info */}
                    <td className="px-4 py-3 font-medium">
                      <TrainerBookingRequestUserBasicInfo
                        email={booking.bookerEmail}
                      />
                    </td>

                    {/* Accepted At */}
                    <td className="px-4 py-3">
                      {formatDate(booking.acceptedAt)}
                    </td>

                    {/* Class Price */}
                    <td className="px-4 py-3">
                      {booking?.totalPrice === "free"
                        ? "Free"
                        : `$ ${booking?.totalPrice}`}
                    </td>

                    {/* Class Duration */}
                    <td className="px-4 py-3">
                      {booking.durationWeeks}{" "}
                      {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                    </td>

                    {/* If Paid or Not */}
                    <td className="px-4 py-3 font-bold capitalize">
                      {booking.paid ? "Paid" : "Not Paid"}
                    </td>

                    {/* Start At */}
                    <td className="px-4 py-3">
                      {booking.startAt
                        ? formatDateWithTextMonth(booking.startAt)
                        : "--/--"}
                    </td>

                    {/* End At */}
                    <td className="px-4 py-3">
                      {booking.status === "Ended" ? (
                        <span className="font-bold text-red-600">Ended</span>
                      ) : booking.endAt ? (
                        formatDateWithTextMonth(booking.endAt)
                      ) : booking.startAt ? (
                        formatDateWithTextMonth(
                          calculateEndAt(booking.startAt, booking.durationWeeks)
                        )
                      ) : (
                        "--/--"
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Accepted Pending Classes : Mobile View */}
          <div className="md:hidden text-black">
            {TrainerBookingAcceptedData.map((booking) => (
              <div
                key={booking._id}
                className={`border border-gray-600 shadow-sm p-4 bg-white space-y-2 ${
                  !booking.startAt ? "bg-green-100" : ""
                }`}
              >
                {/* Booker Info */}
                <div>
                  <TrainerBookingRequestUserBasicInfo
                    email={booking.bookerEmail}
                  />
                </div>

                {/* Accepted At */}
                <div className="flex justify-between">
                  <span className="font-semibold">Accepted At: </span>
                  {formatDate(booking.acceptedAt)}
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

                {/* Payment Status */}
                <div className="flex justify-between">
                  <span className="font-semibold">Status: </span>
                  {booking.paid ? (
                    <p className="text-green-500 font-bold">Paid</p>
                  ) : (
                    <p className="text-red-500 font-bold">Not Paid</p>
                  )}
                </div>

                {/* Start At */}
                <div className="flex justify-between">
                  <span className="font-semibold">Start At: </span>
                  {booking.startAt
                    ? formatDateWithTextMonth(booking.startAt)
                    : "--/--"}
                </div>

                {/* End At */}
                <div className="flex justify-between">
                  <span className="font-semibold">End At: </span>
                  {booking.status === "Ended" ? (
                    <span className="font-bold text-red-600">Ended</span>
                  ) : booking.endAt ? (
                    formatDateWithTextMonth(booking.endAt)
                  ) : booking.startAt ? (
                    formatDateWithTextMonth(
                      calculateEndAt(booking.startAt, booking.durationWeeks)
                    )
                  ) : (
                    "--/--"
                  )}
                </div>

                {/* Actions */}
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
            ))}
          </div>
        </>
      ) : (
        // Fallback display when no accepted bookings exist
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
          No Accepted Bookings Available
        </div>
      )}
    </div>
  );
};

// PropTypes Validation
TrainerScheduleHistoryPending.propTypes = {
  TrainerBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      acceptedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      durationWeeks: PropTypes.number.isRequired,
      paid: PropTypes.bool,
      startAt: PropTypes.string,
      endAt: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
  setSelectedBooking: PropTypes.func.isRequired,
  modalRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default TrainerScheduleHistoryPending;
